import { describe, expect, it } from 'vitest'
import { createFrameSeeker } from '../../src/sections/home/HomeTourVideoSection/createFrameSeeker'

/**
 * A stand-in for an HTMLVideoElement: setting `currentTime` starts a "seek"
 * that only lands when the test fires `seeked`, like a real decoder.
 */
class FakeVideo extends EventTarget {
  readyState = 4
  private time = 0
  assigned: number[] = []

  get currentTime() {
    return this.time
  }
  set currentTime(value: number) {
    this.assigned.push(value)
    this.time = value
  }
  land() {
    this.dispatchEvent(new Event('seeked'))
  }
}

const asVideo = (fake: FakeVideo) => fake as unknown as HTMLVideoElement

describe('createFrameSeeker', () => {
  it('seeks straight away when nothing is in flight', () => {
    const video = new FakeVideo()
    createFrameSeeker(asVideo(video)).seek(5)
    expect(video.assigned).toEqual([5])
  })

  it('keeps only the newest target while a seek is in flight, then applies it when the seek lands', () => {
    const video = new FakeVideo()
    const seeker = createFrameSeeker(asVideo(video))
    seeker.seek(1)
    seeker.seek(2)
    seeker.seek(3)
    seeker.seek(4)
    expect(video.assigned).toEqual([1]) // 2 and 3 were superseded, never sent
    video.land()
    expect(video.assigned).toEqual([1, 4])
    video.land()
    expect(video.assigned).toEqual([1, 4]) // nothing pending: no further seek
  })

  it('ignores a request within half a frame of the frame already shown', () => {
    const video = new FakeVideo()
    const seeker = createFrameSeeker(asVideo(video))
    seeker.seek(2)
    video.land()
    seeker.seek(2 + 1 / 120)
    expect(video.assigned).toEqual([2])
    seeker.seek(2 + 1 / 30)
    expect(video.assigned).toEqual([2, 2 + 1 / 30])
  })

  it('waits for the metadata before seeking, then applies the latest request', () => {
    const video = new FakeVideo()
    video.readyState = 0
    const seeker = createFrameSeeker(asVideo(video))
    seeker.seek(3)
    seeker.seek(7)
    expect(video.assigned).toEqual([])
    video.readyState = 1
    video.dispatchEvent(new Event('loadedmetadata'))
    expect(video.assigned).toEqual([7])
  })

  it('does nothing after it is disposed', () => {
    const video = new FakeVideo()
    const seeker = createFrameSeeker(asVideo(video))
    seeker.seek(1)
    seeker.seek(2)
    seeker.dispose()
    video.land()
    seeker.seek(3)
    expect(video.assigned).toEqual([1])
  })
})
