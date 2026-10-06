/** The few members of an HTMLVideoElement the seeker needs (so it can be tested without a DOM). */
export type SeekableVideo = {
  currentTime: number
  readyState: number
  addEventListener: (type: 'seeked' | 'loadedmetadata', listener: () => void) => void
  removeEventListener: (type: 'seeked' | 'loadedmetadata', listener: () => void) => void
}

/** Closer than this to the target (about one frame at 60 fps) is "already there". */
const EPSILON = 1 / 60

/**
 * Drives `video.currentTime` from a stream of scroll-driven targets without
 * piling up seeks: while a seek is in flight the newest target is only
 * remembered, and when the seek finishes the video seeks again if it is not
 * yet where the scroll wants it ("latest wins"). Nothing is queued per frame
 * and nothing allocates while scrolling. Before the clip's metadata has loaded
 * the target is held, then applied as soon as the clip can seek.
 */
export function createSeeker(video: SeekableVideo) {
  let target = 0
  let seeking = false

  const apply = () => {
    if (video.readyState < 1) return // metadata not loaded: keep the target for later
    if (Math.abs(video.currentTime - target) < EPSILON) {
      seeking = false
      return
    }
    seeking = true
    video.currentTime = target
  }

  const onSeeked = () => {
    seeking = false
    apply()
  }
  const onMetadata = () => apply()

  video.addEventListener('seeked', onSeeked)
  video.addEventListener('loadedmetadata', onMetadata)

  return {
    /** Ask for the clip to show `time` seconds in. */
    seek(time: number) {
      target = time
      if (!seeking) apply()
    },
    /** The most recently requested time. */
    get target() {
      return target
    },
    dispose() {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onMetadata)
    },
  }
}

/**
 * Which chapters keep media mounted when `active` is current: the current one
 * and the next (about to be needed), plus the previous one so that scrolling
 * back is instant. Everything farther away is released.
 */
export function loadWindow(active: number, count: number): number[] {
  const out: number[] = []
  for (let i = Math.max(0, active - 1); i <= Math.min(count - 1, active + 1); i++) out.push(i)
  return out
}
