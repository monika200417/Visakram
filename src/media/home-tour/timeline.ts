import { HOME_TOUR_HANDOFF, homeTourSequence } from './manifest'

/**
 * The scroll timeline for the Home Tour: pure TypeScript, no DOM, no React.
 *
 *   normalized progress p ∈ [0, 1]
 *        → which chapter is active
 *        → which clip(s) are on screen, at what clip time, at what opacity
 *
 * Chapters share the pin in proportion to their `scrollVh`. Between two
 * chapters there is a short handoff window centred on the boundary: the
 * outgoing clip holds its last frame, the incoming clip holds its first frame,
 * and the incoming one fades in over it. (Where a pair of clips is cut to match
 * frame-for-frame the fade is imperceptible; where it is not, it is a quiet
 * crossfade — never a wipe or a zoom.) Everything is a pure function of p, so
 * scrolling backward retraces the same frames exactly.
 */
export type TimelineInput = {
  id: string
  start: number
  end: number
  scrollVh: number
}

export type FrameLayer = {
  /** Index into the chapter list. */
  index: number
  /** Time to show, in seconds into that chapter's clip. */
  time: number
  /** 0–1. The top layer fades in over the one beneath. */
  opacity: number
}

export type Frame = {
  /** The chapter the copy and journey line should show. */
  active: number
  /** One layer, or two during a handoff (outgoing first, incoming on top). */
  layers: FrameLayer[]
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

export function buildTimeline(chapters: readonly TimelineInput[], handoff = HOME_TOUR_HANDOFF) {
  const n = chapters.length
  if (n === 0) throw new Error('A Home Tour timeline needs at least one chapter')
  const total = chapters.reduce((sum, c) => sum + c.scrollVh, 0)

  const from: number[] = []
  const to: number[] = []
  let cursor = 0
  for (const c of chapters) {
    from.push(cursor / total)
    cursor += c.scrollVh
    to.push(cursor / total)
  }
  to[n - 1] = 1

  const half = n > 1 ? handoff / 2 : 0
  for (let i = 0; i < n; i++) {
    if (to[i]! - from[i]! <= handoff) {
      throw new Error(`Chapter "${chapters[i]!.id}" is too short for the handoff`)
    }
  }

  /** The part of chapter i's span in which its clip actually plays. */
  const playFrom = (i: number) => from[i]! + (i > 0 ? half : 0)
  const playTo = (i: number) => to[i]! - (i < n - 1 ? half : 0)

  const timeIn = (i: number, p: number) => {
    const c = chapters[i]!
    const t = (p - playFrom(i)) / (playTo(i) - playFrom(i))
    return c.start + Math.min(1, Math.max(0, t)) * (c.end - c.start)
  }

  const frameAt = (progress: number): Frame => {
    const p = Math.min(1, Math.max(0, progress))
    // Handoff windows sit on the boundaries between chapters
    for (let i = 0; i < n - 1; i++) {
      const boundary = to[i]!
      if (p > boundary - half && p < boundary + half) {
        const t = (p - (boundary - half)) / handoff
        return {
          active: t < 0.5 ? i : i + 1,
          layers: [
            { index: i, time: chapters[i]!.end, opacity: 1 },
            { index: i + 1, time: chapters[i + 1]!.start, opacity: smooth(t) },
          ],
        }
      }
    }
    let active = n - 1
    for (let i = 0; i < n - 1; i++) {
      if (p < to[i]!) {
        active = i
        break
      }
    }
    return { active, layers: [{ index: active, time: timeIn(active, p), opacity: 1 }] }
  }

  return {
    count: n,
    /** Where chapter i begins and ends in progress (the handoffs sit on these). */
    from,
    to,
    /** The centre of each chapter's playing span — where the journey line puts its station. */
    anchors: chapters.map((_, i) => (playFrom(i) + playTo(i)) / 2),
    frameAt,
    chapterIndexAt: (p: number) => frameAt(p).active,
  }
}

export type HomeTourTimeline = ReturnType<typeof buildTimeline>

export const homeTourTimeline = buildTimeline(homeTourSequence)
