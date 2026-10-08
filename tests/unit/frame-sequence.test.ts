import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createFrameSequence,
  type DrawableFrame,
  type FrameLoader,
} from '../../src/media/createFrameSequence'

/**
 * jsdom has no canvas and no image decoding, so the loader and the canvas are
 * stood in for. What this verifies is the sequence's own contract: which frames
 * it asks for and in what order, that it never shows a hole, that memory stays
 * bounded, and that stale work is cancelled.
 */
type Deferred = {
  signal: AbortSignal
  resolve: () => void
  reject: () => void
}

function setup(
  options: {
    frameCount?: number
    cacheSize?: number
    window?: number
    ignoreAbort?: boolean
  } = {},
) {
  const frameCount = options.frameCount ?? 72
  const requested: number[] = []
  const pending = new Map<number, Deferred>()
  const disposed: number[] = []
  const drawn: number[] = []

  const loadFrame: FrameLoader = (url, signal) =>
    new Promise<DrawableFrame>((resolve, reject) => {
      const index = Number(/f_(\d+)/.exec(url)![1]) - 1
      requested.push(index)
      const frame: DrawableFrame = {
        source: { index } as unknown as CanvasImageSource,
        width: 1280,
        height: 720,
        dispose: () => disposed.push(index),
      }
      pending.set(index, {
        signal,
        resolve: () => resolve(frame),
        reject: () => reject(new Error('failed')),
      })
      if (!options.ignoreAbort) {
        signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
      }
    })

  const context = {
    drawImage: (source: { index: number }) => drawn.push(source.index),
  }
  const canvas = {
    width: 0,
    height: 0,
    clientWidth: 1280,
    clientHeight: 720,
    getContext: () => context,
  } as unknown as HTMLCanvasElement

  const onReady = vi.fn()
  const sequence = createFrameSequence({
    canvas,
    frameCount,
    frameUrl: (i) => `/f_${String(i + 1).padStart(4, '0')}.webp`,
    stride: 6,
    cacheSize: options.cacheSize ?? 16,
    window: options.window ?? 6,
    concurrency: 4,
    onReady,
    loadFrame,
  })

  const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
  const land = async (...indexes: number[]) => {
    for (const index of indexes) pending.get(index)?.resolve()
    await flush()
  }
  /** Lands everything in flight, round after round, until nothing more is requested. */
  const settle = async () => {
    for (let round = 0; round < 12; round += 1) {
      const before = requested.length
      for (let i = 0; i < frameCount; i += 1) await land(i)
      if (requested.length === before) return
    }
  }
  return { sequence, requested, pending, disposed, drawn, onReady, land, flush, canvas, settle }
}

afterEach(() => vi.restoreAllMocks())

describe('createFrameSequence', () => {
  it('sizes the canvas to its box and starts pass 1 with the keyframes nearest the playhead', () => {
    const { requested, canvas } = setup()
    expect(canvas.width).toBe(1280)
    expect(canvas.height).toBe(720)
    expect(requested).toEqual([0, 6, 12, 18])
  })

  it('works through every 6th frame (and the last) before it fills in the gaps', async () => {
    const { requested, settle } = setup()
    await settle()
    const keyframes = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 71]
    expect(requested.slice(0, keyframes.length).sort((a, b) => a - b)).toEqual(keyframes)
    // only after pass 1 does it ask for in-between frames, all near the playhead (frame 0)
    const gaps = requested.slice(keyframes.length)
    expect(gaps.length).toBeGreaterThan(0)
    for (const index of gaps) expect(index).toBeLessThanOrEqual(6)
  })

  it('paints the first frame as soon as it lands, announcing readiness exactly once', async () => {
    const { land, drawn, onReady } = setup()
    expect(drawn).toEqual([])
    await land(0)
    expect(drawn).toEqual([0])
    expect(onReady).toHaveBeenCalledTimes(1)
    await land(6)
    expect(onReady).toHaveBeenCalledTimes(1)
  })

  it('never shows a hole: it paints the nearest decoded frame, and does not repaint an unchanged one', async () => {
    const { sequence, land, drawn } = setup()
    await land(0, 6, 12)
    drawn.length = 0
    sequence.show(10) // frame 10 is not decoded; 12 is the nearest
    expect(drawn).toEqual([12])
    sequence.show(11.4) // rounds to 11 — still nearest to 12
    expect(drawn).toEqual([12])
    sequence.show(0)
    expect(drawn).toEqual([12, 0])
  })

  it('latest target wins: loading follows the playhead nearest-first and aborts stale requests', async () => {
    const { sequence, requested, pending, settle } = setup()
    await settle()
    const before = requested.length
    sequence.show(40)
    const fresh = requested.slice(before)
    expect(fresh.length).toBeGreaterThan(0)
    expect(fresh[0]).toBe(40)
    for (const index of fresh) expect(Math.abs(index - 40)).toBeLessThanOrEqual(6)

    // jump far away: requests still in flight near 40 are cancelled
    const inflight = [...pending.entries()]
      .filter(([, deferred]) => !deferred.signal.aborted)
      .map(([index]) => index)
    sequence.show(2)
    const cancelled = inflight.filter((index) => pending.get(index)!.signal.aborted)
    expect(cancelled.length).toBeGreaterThan(0)
    for (const index of cancelled) expect(Math.abs(index - 2)).toBeGreaterThan(6)
  })

  it('keeps decoded memory bounded, releasing the frames farthest from the playhead first', async () => {
    const { sequence, disposed, settle, requested } = setup({ cacheSize: 8 })
    sequence.show(0)
    await settle()
    // 13 keyframes plus the window were decoded; only 8 may be held
    expect(disposed.length).toBeGreaterThanOrEqual(5)
    const kept = [...new Set(requested)].filter((i) => !disposed.includes(i))
    expect(kept.length).toBeLessThanOrEqual(8)
    // frame 0 is at the playhead, so it is never the one released
    expect(disposed).not.toContain(0)
  })

  it('skips a frame that fails to load without retrying it, and keeps painting', async () => {
    const { sequence, requested, pending, drawn, flush } = setup()
    pending.get(0)!.reject()
    await flush()
    pending.get(6)!.resolve()
    await flush()
    expect(drawn).toEqual([6]) // the nearest frame that did load
    sequence.show(0)
    await flush()
    expect(requested.filter((i) => i === 0)).toHaveLength(1)
  })

  it('dispose aborts every request, releases every frame, and ignores later calls', async () => {
    const { sequence, pending, disposed, drawn, land, requested } = setup()
    await land(0, 6)
    const outstanding = [...pending.entries()]
      .filter(([index]) => index !== 0 && index !== 6)
      .map(([, deferred]) => deferred)
    sequence.dispose()
    expect(disposed.sort((a, b) => a - b)).toEqual([0, 6])
    expect(outstanding.every((deferred) => deferred.signal.aborted)).toBe(true)
    const count = requested.length
    const painted = drawn.length
    sequence.show(30)
    sequence.resize()
    expect(requested).toHaveLength(count)
    expect(drawn).toHaveLength(painted)
  })

  it('releases a frame that finishes decoding after dispose', async () => {
    const { sequence, pending, disposed, flush } = setup({ ignoreAbort: true })
    sequence.dispose()
    // a loader that ignores the abort and still resolves
    pending.get(0)!.resolve()
    await flush()
    expect(disposed).toContain(0)
  })
})
