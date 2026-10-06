/**
 * Small, dependency-free curve math for the Home Tour camera: a centripetal
 * Catmull-Rom spline (smooth, no overshoot or loops) and a monotone cubic
 * (PCHIP) interpolant (smooth, never moves backward). Pure TypeScript — no
 * three.js — so the overlay and tests can use the camera timing without
 * loading the 3D chunk.
 */
export type V3 = [number, number, number]

export function dist(a: readonly number[], b: readonly number[]): number {
  return Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!)
}

export function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

function mix(a: readonly number[], b: readonly number[], t: number): V3 {
  return [a[0]! + (b[0]! - a[0]!) * t, a[1]! + (b[1]! - a[1]!) * t, a[2]! + (b[2]! - a[2]!) * t]
}

/**
 * Centripetal Catmull-Rom through `points`, evaluated at u ∈ [0, n − 1]
 * (the integer part picks the segment). End points are reflected so the
 * curve starts and ends cleanly.
 */
export function centripetalSpline(points: ReadonlyArray<readonly number[]>) {
  const n = points.length
  const at = (u: number): V3 => {
    const clamped = Math.min(n - 1, Math.max(0, u))
    const i = Math.min(Math.floor(clamped), n - 2)
    const s = clamped - i

    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p0 = i > 0 ? points[i - 1]! : (mix(p1, p2, -1) as readonly number[])
    const p3 = i + 2 < n ? points[i + 2]! : (mix(p2, p1, -1) as readonly number[])

    const t0 = 0
    const t1 = t0 + Math.max(dist(p0, p1), 1e-4) ** 0.5
    const t2 = t1 + Math.max(dist(p1, p2), 1e-4) ** 0.5
    const t3 = t2 + Math.max(dist(p2, p3), 1e-4) ** 0.5
    const t = t1 + (t2 - t1) * s

    const a1 = mix(p0, p1, (t - t0) / (t1 - t0))
    const a2 = mix(p1, p2, (t - t1) / (t2 - t1))
    const a3 = mix(p2, p3, (t - t2) / (t3 - t2))
    const b1 = mix(a1, a2, (t - t0) / (t2 - t0))
    const b2 = mix(a2, a3, (t - t1) / (t3 - t1))
    return mix(b1, b2, (t - t1) / (t2 - t1))
  }
  return { at, count: n }
}

/**
 * Monotone cubic Hermite (Fritsch–Carlson) through (xs, ys). Because it
 * preserves monotonicity, a non-decreasing `ys` can never make the camera
 * move backward, and flat stretches (dwells) get zero velocity — the camera
 * eases into and out of every hold.
 */
export function pchip(xs: readonly number[], ys: readonly number[]) {
  const n = xs.length
  const h: number[] = []
  const delta: number[] = []
  for (let k = 0; k < n - 1; k++) {
    h.push(xs[k + 1]! - xs[k]!)
    delta.push((ys[k + 1]! - ys[k]!) / h[k]!)
  }
  const d: number[] = new Array<number>(n).fill(0)
  if (n === 2) {
    d[0] = delta[0]!
    d[1] = delta[0]!
  } else {
    for (let k = 1; k < n - 1; k++) {
      if (delta[k - 1]! * delta[k]! <= 0) {
        d[k] = 0
      } else {
        const w1 = 2 * h[k]! + h[k - 1]!
        const w2 = h[k]! + 2 * h[k - 1]!
        d[k] = (w1 + w2) / (w1 / delta[k - 1]! + w2 / delta[k]!)
      }
    }
    const end = (h0: number, h1: number, d0: number, d1: number) => {
      let v = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1)
      if (Math.sign(v) !== Math.sign(d0)) v = 0
      else if (Math.sign(d0) !== Math.sign(d1) && Math.abs(v) > 3 * Math.abs(d0)) v = 3 * d0
      return v
    }
    d[0] = end(h[0]!, h[1]!, delta[0]!, delta[1]!)
    d[n - 1] = end(h[n - 2]!, h[n - 3]!, delta[n - 2]!, delta[n - 3]!)
  }

  return (x: number): number => {
    if (x <= xs[0]!) return ys[0]!
    if (x >= xs[n - 1]!) return ys[n - 1]!
    let lo = 0
    let hi = n - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (xs[mid]! <= x) lo = mid
      else hi = mid
    }
    const k = lo
    const t = (x - xs[k]!) / h[k]!
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[k]! +
      (t3 - 2 * t2 + t) * h[k]! * d[k]! +
      (-2 * t3 + 3 * t2) * ys[k + 1]! +
      (t3 - t2) * h[k]! * d[k + 1]!
    )
  }
}
