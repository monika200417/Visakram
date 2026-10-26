/**
 * The two looks of the cursor's stars. Over the cream pages they are Visakram orange only (Lac Red,
 * one shade), solid enough to read on cream. Over photographs, video and dark grounds they are gold
 * with a pale core, as they were on the homepage hero, so they read on bright cloud and on dark glass.
 */
export type StarPalette = {
  colors: readonly string[]
  /** how solid a star is at its fullest; 1 would be fully opaque */
  opacity: number
  core: string
  edge: string
  halo: string
}

export const GOLD: StarPalette = {
  colors: ['#F6E3A1', '#D4AF37', '#FFF4C8', '#FFFFFF', '#E9C65B'],
  opacity: 0.42,
  core: 'rgba(255, 255, 255, 0.85)',
  edge: 'rgba(255, 252, 235, 0.7)',
  halo: 'rgba(24, 20, 14, 0.3)',
}

export const ORANGE: StarPalette = {
  colors: ['#C4441F', '#C4441F', '#C4441F', '#C4441F', '#C4441F'],
  opacity: 0.72,
  core: 'rgba(255, 235, 220, 0.9)',
  edge: 'rgba(255, 224, 205, 0.55)',
  halo: 'rgba(80, 24, 8, 0.2)',
}

/** Relative luminance (0–1) of an `rgb()/rgba()` string, or null when it is (nearly) transparent. */
function groundLuminance(color: string): number | null {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = (m[1] ?? '')
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number)
  const [r = 0, g = 0, b = 0, a = 1] = parts
  if (a < 0.5) return null
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

/**
 * Which stars to drop over `target`. The nearest ancestor can pin it with data-stars="gold" | "orange"
 * (the hero does); a photograph, video or canvas is gold; otherwise the first opaque background found
 * walking up decides — dark is gold, light is orange. The page itself is cream, so no opaque ancestor
 * means orange.
 */
export function starPaletteFor(target: Element | null): StarPalette {
  for (let el: Element | null = target; el; el = el.parentElement) {
    const pinned = el.getAttribute('data-stars')
    if (pinned) return pinned === 'gold' ? GOLD : ORANGE
    if (
      el instanceof HTMLImageElement ||
      el instanceof HTMLVideoElement ||
      el instanceof HTMLCanvasElement
    ) {
      return GOLD
    }
    const lum = groundLuminance(getComputedStyle(el).backgroundColor)
    if (lum !== null) return lum < 0.45 ? GOLD : ORANGE
  }
  return ORANGE
}
