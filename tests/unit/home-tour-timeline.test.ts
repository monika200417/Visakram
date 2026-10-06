import { describe, expect, it } from 'vitest'
import { homeTourSequence } from '../../src/media/home-tour/manifest'
import { buildTimeline, homeTourTimeline } from '../../src/media/home-tour/timeline'

const chapters = [
  { id: 'a', start: 1, end: 3, scrollVh: 200 },
  { id: 'b', start: 10, end: 14, scrollVh: 100 },
  { id: 'c', start: 0, end: 2, scrollVh: 100 },
]
const timeline = buildTimeline(chapters, 0.1)

describe('Home Tour timeline', () => {
  it('splits progress between chapters in proportion to their scroll length', () => {
    expect(timeline.from).toEqual([0, 0.5, 0.75])
    expect(timeline.to).toEqual([0.5, 0.75, 1])
  })

  it('maps progress to clip time across each chapter, holding at both ends of the handoffs', () => {
    // chapter a: plays from 0 to 0.45 (the last 0.05 belongs to the handoff)
    expect(timeline.frameAt(0).layers).toEqual([{ index: 0, time: 1, opacity: 1 }])
    const mid = timeline.frameAt(0.225).layers[0]!
    expect(mid.index).toBe(0)
    expect(mid.time).toBeCloseTo(2, 6)
    expect(timeline.frameAt(0.449).layers[0]!.time).toBeCloseTo(3, 1)
    // chapter b plays 0.55 → 0.70 and its middle is its middle
    expect(timeline.frameAt(0.625).layers[0]!.time).toBeCloseTo(12, 6)
    // the very end rests on the last frame of the last chapter
    expect(timeline.frameAt(1).layers).toEqual([{ index: 2, time: 2, opacity: 1 }])
  })

  it('crossfades over a handoff: outgoing holds its last frame, incoming holds its first', () => {
    const before = timeline.frameAt(0.4501)
    expect(before.layers).toHaveLength(2)
    expect(before.layers[0]).toEqual({ index: 0, time: 3, opacity: 1 })
    expect(before.layers[1]!.index).toBe(1)
    expect(before.layers[1]!.time).toBe(10)
    expect(before.layers[1]!.opacity).toBeLessThan(0.05)

    const middle = timeline.frameAt(0.5)
    expect(middle.layers[1]!.opacity).toBeCloseTo(0.5, 6)

    const after = timeline.frameAt(0.5499)
    expect(after.layers[1]!.opacity).toBeGreaterThan(0.95)
    // once the handoff is over only the incoming clip remains, at its first frame
    const done = timeline.frameAt(0.551)
    expect(done.layers).toHaveLength(1)
    expect(done.layers[0]!.time).toBeCloseTo(10, 1)
  })

  it('selects the active chapter, switching at the middle of each handoff', () => {
    expect(timeline.chapterIndexAt(0)).toBe(0)
    expect(timeline.chapterIndexAt(0.49)).toBe(0)
    expect(timeline.chapterIndexAt(0.51)).toBe(1)
    expect(timeline.chapterIndexAt(0.74)).toBe(1)
    expect(timeline.chapterIndexAt(0.76)).toBe(2)
    expect(timeline.chapterIndexAt(1)).toBe(2)
  })

  it('clamps progress outside 0–1', () => {
    expect(timeline.frameAt(-5)).toEqual(timeline.frameAt(0))
    expect(timeline.frameAt(9)).toEqual(timeline.frameAt(1))
  })

  it('is reversible: the same progress always gives the same frame, forward or backward', () => {
    const forward: unknown[] = []
    for (let i = 0; i <= 200; i++) forward.push(timeline.frameAt(i / 200))
    const backward: unknown[] = []
    for (let i = 200; i >= 0; i--) backward.unshift(timeline.frameAt(i / 200))
    expect(backward).toEqual(forward)
  })

  it('never skips or reverses a chapter, and clip time never runs backward while a clip plays', () => {
    let lastActive = 0
    let lastPlaying: { index: number; time: number } | null = null
    for (let i = 0; i <= 4000; i++) {
      const frame = timeline.frameAt(i / 4000)
      expect(frame.active).toBeGreaterThanOrEqual(lastActive)
      expect(frame.active - lastActive).toBeLessThanOrEqual(1)
      lastActive = frame.active
      if (frame.layers.length === 1) {
        const only = frame.layers[0]!
        if (lastPlaying && lastPlaying.index === only.index) {
          expect(only.time).toBeGreaterThanOrEqual(lastPlaying.time - 1e-9)
        }
        lastPlaying = { index: only.index, time: only.time }
      }
    }
  })

  it('places each journey-line anchor inside its own chapter, in order', () => {
    timeline.anchors.forEach((a, i) => {
      expect(a).toBeGreaterThan(timeline.from[i]!)
      expect(a).toBeLessThan(timeline.to[i]!)
      if (i > 0) expect(a).toBeGreaterThan(timeline.anchors[i - 1]!)
    })
  })

  it('works for a single chapter (no handoff) and rejects bad input', () => {
    const single = buildTimeline([{ id: 'only', start: 2, end: 4, scrollVh: 100 }])
    expect(single.frameAt(0.5).layers).toEqual([{ index: 0, time: 3, opacity: 1 }])
    expect(() => buildTimeline([])).toThrow()
    expect(() =>
      buildTimeline(
        [
          { id: 'x', start: 0, end: 1, scrollVh: 1 },
          { id: 'y', start: 0, end: 1, scrollVh: 100 },
        ],
        0.1,
      ),
    ).toThrow(/too short/)
  })

  it('builds the real timeline from the manifest, one anchor per chapter', () => {
    expect(homeTourTimeline.count).toBe(homeTourSequence.length)
    expect(homeTourTimeline.anchors).toHaveLength(homeTourSequence.length)
    // first frame is the first chapter's first frame; last is the last chapter's last frame
    expect(homeTourTimeline.frameAt(0).layers[0]!.time).toBe(homeTourSequence[0]!.start)
    expect(homeTourTimeline.frameAt(1).layers[0]!.time).toBe(
      homeTourSequence[homeTourSequence.length - 1]!.end,
    )
  })
})
