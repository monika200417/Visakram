/**
 * Shared helpers for The Visakram Way's SVG visuals — one architectural
 * linework language across all three chapters.
 */

/**
 * Data attributes the scroll hook (useVisakramWayScrub) reads to reveal an
 * element on the chapter's own 0–1 progress. `at`/`dur` are fractions of
 * that chapter. `draw` also draws each child's stroke on (so only use it on
 * groups of solid, un-dashed strokes).
 */
export function reveal(at: number, dur = 0.2, draw = false) {
  return {
    'data-way-reveal': '',
    'data-way-at': at,
    'data-way-dur': dur,
    ...(draw ? { 'data-way-draw': '' } : {}),
  }
}

/** Grow the element upward from its base (scaleY 0 → 1) instead of a plain fade — rising columns. */
export function grow() {
  return { 'data-way-grow': '' }
}

/** Slide the element into place from `y` SVG units above/below (negative = from above) — dropping slabs. */
export function from(y: number) {
  return { 'data-way-from': y }
}

/** Fade the element out again at a later chapter fraction (e.g. connectors that retract). */
export function exit(at: number) {
  return { 'data-way-exit': at }
}

/** Move the element down `y` SVG units at a chapter fraction. */
export function shift(y: number, at: number) {
  return { 'data-way-shift': y, 'data-way-shift-at': at }
}

/** Subtle background/foreground drift over the chapter (parallax). */
export function depth(n: number) {
  return { 'data-way-depth': n }
}

export function range(n: number, step: number, from = 0): number[] {
  return Array.from({ length: n }, (_, i) => from + i * step)
}

const COS30 = Math.cos(Math.PI / 6)

/**
 * 2:1-style isometric projection. (x, y) lie on the ground plane in grid
 * units, z is height in the same units; (cx, cy) is the screen position of
 * the (0, 0, 0) corner and `u` the size of one unit in SVG user units.
 */
export function makeIso(cx: number, cy: number, u: number) {
  const p = (x: number, y: number, z = 0): [number, number] => [
    Math.round((cx + (x - y) * COS30 * u) * 10) / 10,
    Math.round((cy + (x + y) * 0.5 * u - z * u) * 10) / 10,
  ]
  const pt = (x: number, y: number, z = 0) => p(x, y, z).join(',')
  const poly = (pts: ReadonlyArray<readonly [number, number, number]>) =>
    pts.map(([x, y, z]) => pt(x, y, z)).join(' ')
  const line = (a: readonly [number, number, number], b: readonly [number, number, number]) => {
    const [x1, y1] = p(...a)
    const [x2, y2] = p(...b)
    return { x1, y1, x2, y2 }
  }
  return { p, pt, poly, line }
}
