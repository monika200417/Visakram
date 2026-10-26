/**
 * A "latest wins" seeker for scroll-scrubbed video. Setting `currentTime`
 * while a seek is still in flight makes browsers abandon and restart decoding,
 * which stutters; instead only the newest target is remembered while a seek
 * runs, and it is applied the moment that seek lands. The video is never
 * played — it only ever shows the frame for the time it was last asked for.
 *
 * Plain DOM, no React: it is driven from the scroll trigger's update callback,
 * so scrolling never causes a React render.
 */
export type FrameSeeker = {
  /** Ask for the frame at `time` seconds. Safe to call every scroll tick. */
  seek: (time: number) => void
  dispose: () => void
}

/** Half a frame at 30 fps: a request closer than this to the shown frame is a no-op. */
const FRAME_EPSILON = 1 / 60

export function createFrameSeeker(video: HTMLVideoElement): FrameSeeker {
  let pending: number | null = null
  let seeking = false
  let disposed = false

  const apply = () => {
    if (disposed || pending === null) return
    // Nothing can be seeked until the metadata is in; `loadedmetadata` re-applies.
    if (video.readyState < 1) return
    const target = pending
    pending = null
    if (Math.abs(video.currentTime - target) < FRAME_EPSILON) return
    seeking = true
    video.currentTime = target
  }

  const onSeeked = () => {
    seeking = false
    apply()
  }
  const onLoadedMetadata = () => {
    seeking = false
    apply()
  }

  video.addEventListener('seeked', onSeeked)
  video.addEventListener('loadedmetadata', onLoadedMetadata)

  return {
    seek(time) {
      pending = time
      if (!seeking) apply()
    },
    dispose() {
      disposed = true
      pending = null
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    },
  }
}
