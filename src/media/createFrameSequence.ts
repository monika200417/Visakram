/**
 * A scroll-scrubbed image sequence painted on a canvas. The technique is the
 * studied template's — a first pass over every Nth frame so the whole arc is
 * scrubbable almost at once, then the gaps filled in nearest to the playhead —
 * made safe for a real page:
 *
 *  - latest target wins: `show()` only records where the playhead is and paints
 *    the nearest frame already decoded, so scrubbing never shows a hole;
 *  - bounded memory: at most `cacheSize` decoded frames are kept, and the one
 *    farthest from the playhead is released first (the encoded files stay in the
 *    HTTP cache, so scrolling back re-decodes them cheaply);
 *  - cancelled work: requests that fall outside the window around the playhead
 *    are aborted; `dispose()` aborts everything and releases every frame;
 *  - no React: it is driven imperatively from a scroll trigger's update callback.
 *
 * The sequence never throws on a network or decode failure — a frame that cannot
 * be loaded is simply skipped, and the poster behind the canvas stays the fallback.
 */
export type DrawableFrame = {
  source: CanvasImageSource
  width: number
  height: number
  /** Release the decoded pixels. */
  dispose: () => void
}

export type FrameLoader = (url: string, signal: AbortSignal) => Promise<DrawableFrame>

export type FrameSequenceOptions = {
  canvas: HTMLCanvasElement
  frameCount: number
  frameUrl: (index: number) => string
  /** Pass 1 loads every Nth frame. */
  stride?: number
  /** Most decoded frames kept at once. */
  cacheSize?: number
  /** Pass 2 keeps this many frames either side of the playhead loaded. */
  window?: number
  /** Most requests in flight at once. */
  concurrency?: number
  /** Horizontal focal point (0–1) kept in view when the frame is cropped to fit. Default centred. */
  focalX?: number
  /** Called once, when the first frame has been painted. */
  onReady?: () => void
  /** Replaces the default fetch + decode, for tests. */
  loadFrame?: FrameLoader
}

export type FrameSequence = {
  /** Move the playhead to a (fractional) frame index. Safe to call every scroll tick. */
  show: (frame: number) => void
  /** Re-measure the canvas and repaint. Call when its size changes. */
  resize: () => void
  /** Stop all loading and release every decoded frame. */
  dispose: () => void
}

/** Whether this browser can load frames at all; without it the poster simply stays. */
export function canLoadFrames(): boolean {
  return typeof fetch === 'function' && typeof createImageBitmap === 'function'
}

/** Fetches a frame and decodes it off the main thread. */
export const loadFrameBitmap: FrameLoader = async (url, signal) => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Hero frame ${url}: HTTP ${response.status}`)
  const bitmap = await createImageBitmap(await response.blob())
  return {
    source: bitmap,
    width: bitmap.width,
    height: bitmap.height,
    dispose: () => bitmap.close(),
  }
}

/** The backing store is never larger than this, however big the screen or its pixel ratio. */
const MAX_BACKING_WIDTH = 1920

export function createFrameSequence(options: FrameSequenceOptions): FrameSequence {
  const {
    canvas,
    frameCount,
    frameUrl,
    stride = 6,
    cacheSize = 20,
    window: windowSize = 7,
    concurrency = 4,
    focalX = 0.5,
    onReady,
    loadFrame = loadFrameBitmap,
  } = options

  const frames = new Map<number, DrawableFrame>()
  const inflight = new Map<number, AbortController>()
  const failed = new Set<number>()
  const pendingKeyframes = new Set<number>()
  for (let i = 0; i < frameCount; i += stride) pendingKeyframes.add(i)
  pendingKeyframes.add(frameCount - 1)

  let target = 0
  let drawn = -1
  let disposed = false
  let announced = false

  const clamp = (index: number) => Math.min(frameCount - 1, Math.max(0, index))

  /** The decoded frame closest to `index`, or -1 while nothing has loaded. */
  const nearestLoaded = (index: number) => {
    if (frames.has(index)) return index
    for (let d = 1; d < frameCount; d += 1) {
      if (frames.has(index - d)) return index - d
      if (frames.has(index + d)) return index + d
    }
    return -1
  }

  const paint = () => {
    if (disposed) return
    const index = nearestLoaded(target)
    if (index < 0 || index === drawn) return
    const frame = frames.get(index)!
    const context = canvas.getContext('2d', { alpha: false })
    if (!context || !canvas.width || !canvas.height) return

    // cover: fill the canvas, keep the frame's aspect ratio, crop only the overflow
    const scale = Math.max(canvas.width / frame.width, canvas.height / frame.height)
    const w = frame.width * scale
    const h = frame.height * scale
    context.drawImage(frame.source, (canvas.width - w) * focalX, (canvas.height - h) / 2, w, h)
    drawn = index

    if (!announced) {
      announced = true
      onReady?.()
    }
  }

  const evict = () => {
    while (frames.size > cacheSize) {
      let farthest = -1
      let farthestDistance = -1
      for (const index of frames.keys()) {
        const distance = Math.abs(index - target)
        if (distance > farthestDistance) {
          farthest = index
          farthestDistance = distance
        }
      }
      frames.get(farthest)?.dispose()
      frames.delete(farthest)
    }
  }

  const isWanted = (index: number) =>
    !frames.has(index) && !inflight.has(index) && !failed.has(index)

  /** The next frame worth requesting, or -1. Pass 1 first, then the window; always nearest-first. */
  const nextWanted = () => {
    let best = -1
    let bestDistance = Infinity
    for (const index of pendingKeyframes) {
      if (!isWanted(index)) continue
      const distance = Math.abs(index - target)
      if (distance < bestDistance) {
        best = index
        bestDistance = distance
      }
    }
    if (best >= 0) return best

    for (let d = 0; d <= windowSize; d += 1) {
      for (const index of [target - d, target + d]) {
        if (index >= 0 && index < frameCount && isWanted(index)) return index
      }
    }
    return -1
  }

  const abortStale = () => {
    // While pass 1 runs, everything it asked for is useful. After it, anything outside the window is stale.
    if (pendingKeyframes.size > 0) return
    for (const [index, controller] of inflight) {
      if (Math.abs(index - target) > windowSize + 1) controller.abort()
    }
  }

  const start = (index: number) => {
    const controller = new AbortController()
    inflight.set(index, controller)
    loadFrame(frameUrl(index), controller.signal).then(
      (frame) => {
        inflight.delete(index)
        pendingKeyframes.delete(index)
        if (disposed || controller.signal.aborted) {
          frame.dispose()
        } else {
          frames.set(index, frame)
          evict()
          paint()
        }
        pump()
      },
      () => {
        inflight.delete(index)
        pendingKeyframes.delete(index)
        // an aborted request is only stale, not broken: it may be wanted again later
        if (!controller.signal.aborted) failed.add(index)
        pump()
      },
    )
  }

  function pump() {
    if (disposed) return
    while (inflight.size < concurrency) {
      const index = nextWanted()
      if (index < 0) return
      start(index)
    }
  }

  const resize = () => {
    if (disposed) return
    const ratio = Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, 2)
    const cssWidth = canvas.clientWidth
    const cssHeight = canvas.clientHeight
    if (!cssWidth || !cssHeight) return
    const width = Math.min(Math.round(cssWidth * ratio), MAX_BACKING_WIDTH)
    const height = Math.round((cssHeight * width) / cssWidth)
    if (canvas.width === width && canvas.height === height) return
    canvas.width = width
    canvas.height = height
    drawn = -1
    paint()
  }

  resize()
  pump()

  return {
    show(frame) {
      if (disposed) return
      target = clamp(Math.round(frame))
      paint()
      abortStale()
      pump()
    },
    resize,
    dispose() {
      if (disposed) return
      disposed = true
      for (const controller of inflight.values()) controller.abort()
      inflight.clear()
      for (const frame of frames.values()) frame.dispose()
      frames.clear()
    },
  }
}
