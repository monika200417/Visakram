import { centripetalSpline, dist, pchip, smoothstep, type V3 } from './pathMath'

export type Waypoint = {
  id: string
  position: readonly [number, number, number]
  lookAt: readonly [number, number, number]
  fov: number
  /** Marks the anchor of one of the chapters (same id as the chapter). */
  chapter?: boolean
  /**
   * For a chapter anchor: the id of an earlier waypoint whose arrival begins
   * the chapter. Without it the chapter begins midway to the previous anchor.
   */
  chapterFrom?: string
  /** Hold time (in path-seconds) the camera lingers here. Chapters dwell. */
  dwell?: number
  /** Speed multiplier for the segment arriving at this waypoint (default 1). */
  speed?: number
}

export type TourSample = {
  position: V3
  lookAt: V3
  fov: number
}

/** Cinematic cruising speed in metres per path-second (segments scale it). */
const BASE_SPEED = 2.0
/** Dense arc-length samples per waypoint segment. */
const SAMPLES_PER_SEGMENT = 64
/** Gentle forward drift while the camera dwells on a chapter (metres). */
const DWELL_DRIFT = 0.25

/**
 * Builds the camera timeline from the waypoints:
 *
 *  1. a smooth spline through the positions and another through the
 *     look-at targets (both indexed by the same fractional waypoint index);
 *  2. the position spline is arc-length-parameterised;
 *  3. a monotone time→distance curve makes the camera cruise between
 *     waypoints (per-segment speed) and ease into / out of each dwell;
 *  4. normalized scroll progress is that timeline divided by its total time.
 *
 * So progress anchors for the chapters are *derived from the actual path* —
 * they are not hand-typed — and the camera can never cut, jump or reverse.
 */
export function buildTour(waypoints: readonly Waypoint[]) {
  const n = waypoints.length
  const posSpline = centripetalSpline(waypoints.map((w) => w.position))
  const lookSpline = centripetalSpline(waypoints.map((w) => w.lookAt))

  // 1. Arc length along the position spline
  const total = (n - 1) * SAMPLES_PER_SEGMENT
  const cumulative: number[] = [0]
  let previous = posSpline.at(0)
  for (let k = 1; k <= total; k++) {
    const point = posSpline.at(k / SAMPLES_PER_SEGMENT)
    cumulative.push(cumulative[k - 1]! + dist(previous, point))
    previous = point
  }
  const waypointDistance = waypoints.map((_, i) => cumulative[i * SAMPLES_PER_SEGMENT]!)
  const pathLength = cumulative[total]!

  const uAtDistance = (s: number): number => {
    const clamped = Math.min(pathLength, Math.max(0, s))
    let lo = 0
    let hi = total
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (cumulative[mid]! <= clamped) lo = mid
      else hi = mid
    }
    const span = cumulative[hi]! - cumulative[lo]!
    const frac = span > 0 ? (clamped - cumulative[lo]!) / span : 0
    return (lo + frac) / SAMPLES_PER_SEGMENT
  }

  // 2. Time knots: cruise between waypoints, hold (with a slight drift) at dwells
  const timeKnots: number[] = []
  const distanceKnots: number[] = []
  const arrival: number[] = []
  const departure: number[] = []
  let time = 0
  waypoints.forEach((w, i) => {
    if (i > 0) {
      const segment = waypointDistance[i]! - waypointDistance[i - 1]!
      time += segment / (BASE_SPEED * (w.speed ?? 1))
    }
    arrival.push(time)
    timeKnots.push(time)
    distanceKnots.push(waypointDistance[i]!)

    const dwell = w.dwell ?? 0
    if (dwell > 0) {
      time += dwell
      const drift = i < n - 1 ? DWELL_DRIFT : 0
      timeKnots.push(time)
      distanceKnots.push(waypointDistance[i]! + drift)
    }
    departure.push(time)
  })
  const totalTime = time
  const distanceAtTime = pchip(timeKnots, distanceKnots)

  const sampleAtTime = (t: number): TourSample => {
    const u = uAtDistance(distanceAtTime(t))
    const i = Math.min(Math.floor(u), n - 2)
    const f = smoothstep(u - i)
    return {
      position: posSpline.at(u),
      lookAt: lookSpline.at(u),
      fov: waypoints[i]!.fov + (waypoints[i + 1]!.fov - waypoints[i]!.fov) * f,
    }
  }

  /** Camera pose at normalized scroll progress p ∈ [0, 1]. */
  const sample = (p: number): TourSample => sampleAtTime(Math.min(1, Math.max(0, p)) * totalTime)

  // 3. Chapter anchors (centre of each chapter's dwell) and arrival times
  const progressOf = (t: number) => t / totalTime
  const arrivalProgress: Record<string, number> = {}
  waypoints.forEach((w, i) => {
    arrivalProgress[w.id] = progressOf(arrival[i]!)
  })
  const chapterIds: string[] = []
  const anchors: number[] = []
  waypoints.forEach((w, i) => {
    if (!w.chapter) return
    chapterIds.push(w.id)
    anchors.push(progressOf((arrival[i]! + departure[i]!) / 2))
  })

  // A chapter begins at its `chapterFrom` waypoint, or midway to the previous anchor.
  const chapterStarts: number[] = []
  waypoints.forEach((w) => {
    if (!w.chapter) return
    const c = chapterStarts.length
    const from = w.chapterFrom ? arrivalProgress[w.chapterFrom] : undefined
    chapterStarts.push(c === 0 ? 0 : (from ?? (anchors[c - 1]! + anchors[c]!) / 2))
  })

  /** Which chapter is current at progress p. */
  const chapterIndexAt = (p: number): number => {
    let index = 0
    for (let c = 1; c < chapterStarts.length; c++) {
      if (p >= chapterStarts[c]!) index = c
    }
    return index
  }

  return {
    sample,
    anchors,
    chapterIds,
    chapterIndexAt,
    chapterStarts,
    /** Progress at which the camera arrives at any waypoint (chapter or not). */
    arrivalProgress,
    totalTime,
    pathLength,
  }
}
