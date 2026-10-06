import { describe, expect, it } from 'vitest'
import { createSeeker, loadWindow, type SeekableVideo } from '../../src/media/home-tour/seek'

/** A stand-in for a video whose seeks finish only when the test says so. */
function fakeVideo(readyState = 4) {
  const listeners: Record<string, Array<() => void>> = {}
  const writes: number[] = []
  let time = 0
  const video = {
    readyState,
    get currentTime() {
      return time
    },
    set currentTime(v: number) {
      writes.push(v)
      time = v
    },
    addEventListener: (type: string, fn: () => void) => {
      ;(listeners[type] ??= []).push(fn)
    },
    removeEventListener: (type: string, fn: () => void) => {
      listeners[type] = (listeners[type] ?? []).filter((l) => l !== fn)
    },
  }
  const fire = (type: string) => (listeners[type] ?? []).forEach((fn) => fn())
  return {
    video: video as SeekableVideo & { readyState: number },
    writes,
    fire,
    count: () => listeners,
  }
}

describe('createSeeker', () => {
  it('seeks to the requested time', () => {
    const { video, writes } = fakeVideo()
    const seeker = createSeeker(video)
    seeker.seek(1.5)
    expect(writes).toEqual([1.5])
    expect(seeker.target).toBe(1.5)
  })

  it('does not pile up seeks while one is in flight: latest target wins when it lands', () => {
    const { video, writes, fire } = fakeVideo()
    const seeker = createSeeker(video)
    seeker.seek(1)
    seeker.seek(2)
    seeker.seek(3)
    seeker.seek(4)
    expect(writes).toEqual([1]) // one seek in flight, the rest only remembered
    fire('seeked')
    expect(writes).toEqual([1, 4]) // then straight to the newest target
    fire('seeked')
    expect(writes).toEqual([1, 4]) // already there: nothing more to do
  })

  it('ignores changes smaller than about one frame', () => {
    const { video, writes, fire } = fakeVideo()
    const seeker = createSeeker(video)
    seeker.seek(2)
    fire('seeked')
    seeker.seek(2.005)
    expect(writes).toEqual([2])
  })

  it('holds the target until the clip has metadata, then applies it', () => {
    const { video, writes, fire } = fakeVideo(0)
    const seeker = createSeeker(video)
    seeker.seek(0.8)
    expect(writes).toEqual([])
    video.readyState = 1
    fire('loadedmetadata')
    expect(writes).toEqual([0.8])
  })

  it('follows scrolling backward as readily as forward', () => {
    const { video, writes, fire } = fakeVideo()
    const seeker = createSeeker(video)
    seeker.seek(3)
    fire('seeked')
    seeker.seek(1)
    fire('seeked')
    expect(writes).toEqual([3, 1])
  })

  it('stops listening when disposed', () => {
    const { video, count } = fakeVideo()
    const seeker = createSeeker(video)
    expect(count().seeked).toHaveLength(1)
    seeker.dispose()
    expect(count().seeked).toHaveLength(0)
    expect(count().loadedmetadata).toHaveLength(0)
  })
})

describe('loadWindow', () => {
  it('keeps the previous, current and next chapters, and releases the rest', () => {
    expect(loadWindow(0, 9)).toEqual([0, 1])
    expect(loadWindow(4, 9)).toEqual([3, 4, 5])
    expect(loadWindow(8, 9)).toEqual([7, 8])
    expect(loadWindow(0, 1)).toEqual([0])
  })

  it('never includes more than three chapters', () => {
    for (let i = 0; i < 9; i++) expect(loadWindow(i, 9).length).toBeLessThanOrEqual(3)
  })
})
