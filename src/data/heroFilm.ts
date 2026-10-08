/**
 * The hero film — the first 7.1 seconds of the Home Tour footage, cut into a
 * lightweight frame sequence (public/assets/hero/README.md) that the hero scrubs
 * with the page scroll. Pure data and pure functions — no DOM, no React — so the
 * mapping can be tested and tuned in one place. The 31 MB source video is never
 * a hero runtime asset.
 */
export const heroFilm = {
  /** Frames are f_0001 … f_<frameCount>.webp, 1280×720, one every 0.1 s of the source. */
  frameCount: 72,
  width: 1280,
  height: 720,
  basePath: '/assets/hero/frames',
  /** Pass 1 of loading: every Nth frame, so the whole arc is scrubbable almost at once. */
  stride: 6,
  /** Most decoded frames kept in memory at any moment (≈3.7 MB each). */
  cacheSize: 16,
  /** Horizontal focal point (0–1) when the 16:9 frame is cropped to a taller screen; the house sits left of centre. */
  focalX: 0.42,
  /** Frames either side of the playhead pass 2 keeps loaded. */
  window: 6,
  /**
   * Scroll distance the hero pin occupies, as a percentage of the viewport height
   * (it was a 90% crossfade before). About 2.8 screens of scroll for ~7 s of film.
   */
  scrollPercent: 280,
} as const

/** URL of frame `index` (0-based). Frame 0 is also the hero's poster. */
export function heroFramePath(index: number): string {
  return `${heroFilm.basePath}/f_${String(index + 1).padStart(4, '0')}.webp`
}

export const heroPoster = heroFramePath(0)

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Normalized scroll progress (0–1) → a (fractional) frame index, first frame to last. Linear, clamped. */
export function heroFrameAtProgress(progress: number): number {
  return clamp01(progress) * (heroFilm.frameCount - 1)
}
