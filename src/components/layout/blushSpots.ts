/**
 * The soft light-orange "blushes" laid over the page (see `main::before` in styles/layout.css). Their places
 * are drawn at random on each visit, but spread: the page's height is cut into one band per blush and each
 * blush lands somewhere inside its own band, so no two are ever close together. They alternate sides
 * (left, right, right, left, …) at random so the page does not tip to one edge.
 */
export type BlushSpot = {
  /** Per cent across the page, from the left. */
  x: number
  /** Per cent down the page, from the top. */
  y: number
  /** Radius in px of the gradient (the glow has faded out by 70% of it). */
  size: number
}

export const BLUSH_COUNT = 10

/** `random` returns [0, 1): Math.random in the page, a fixed sequence in tests. */
export function blushSpots(random: () => number = Math.random): BlushSpot[] {
  const band = 100 / BLUSH_COUNT
  let leftSide = random() < 0.5
  const spots: BlushSpot[] = []
  for (let i = 0; i < BLUSH_COUNT; i += 1) {
    // alternate the side, but let two in a row share one now and then
    if (random() < 0.75) leftSide = !leftSide
    const x = leftSide ? 2 + random() * 28 : 70 + random() * 28
    // stay clear of the very edges of each band so neighbours are far apart
    const y = i * band + band * (0.12 + random() * 0.76)
    const size = 340 + random() * 300
    spots.push({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      size: Math.round(size),
    })
  }
  return spots
}

/** Writes the spots onto an element as the CSS variables the stylesheet reads. */
export function applyBlushSpots(element: HTMLElement, spots: readonly BlushSpot[]) {
  spots.forEach((spot, i) => {
    element.style.setProperty(`--blush-${i + 1}-x`, `${spot.x}%`)
    element.style.setProperty(`--blush-${i + 1}-y`, `${spot.y}%`)
    element.style.setProperty(`--blush-${i + 1}-size`, `${spot.size}px`)
  })
}
