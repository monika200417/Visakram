import { site } from './site'

export type WayPrinciple = {
  index: string
  title: string
  description: string
}

/**
 * Supporting copy for each of the three verified company values
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §06). Titles are
 * derived from site.values — the single verified source — rather than
 * duplicated here, so this list can never drift from it or grow a fourth,
 * invented principle.
 */
const descriptions: Record<string, string> = {
  Quality:
    'Every material, finish and structural detail is chosen and checked before it becomes part of your home.',
  Timeliness:
    'Clear schedules and steady progress from groundbreaking to handover, so you always know where your project stands.',
  Transparency:
    'Open communication at every stage, so decisions, costs and progress are never a surprise.',
}

export const visakramWayPrinciples: readonly WayPrinciple[] = site.values.map((title, i) => ({
  index: String(i + 1).padStart(2, '0'),
  title,
  description: descriptions[title] ?? '',
}))

export type WayAsset = {
  kind: 'image' | 'video'
  src: string
  alt: string
}

export type WayMotif = 'quality' | 'timeliness' | 'transparency'

export type WayChapterVisual = {
  motif: WayMotif
  /** The three-beat visual story told inside this chapter, in order. */
  beats: readonly [string, string, string]
  /**
   * Optional real client-provided media. When set, WayVisual renders it in
   * place of the conceptual linework, inside the same layer, so swapping in
   * photographs/drawings/video needs no change to the storytelling
   * architecture or animation.
   */
  asset?: WayAsset
}

/**
 * Conceptual visual narrative per principle, keyed by principle title. The
 * procedural visuals are illustrative treatments — not depictions of any
 * actual Visakram project.
 */
const visuals: Record<string, WayChapterVisual> = {
  Quality: { motif: 'quality', beats: ['Material', 'Craftsmanship', 'Finished detail'] },
  Timeliness: { motif: 'timeliness', beats: ['Site', 'Structure', 'Visible progress'] },
  Transparency: { motif: 'transparency', beats: ['Plan', 'Decisions', 'Clarity'] },
}

export function getWayVisual(title: string): WayChapterVisual {
  return visuals[title] ?? { motif: 'quality', beats: ['', '', ''] }
}

/**
 * Where, as a fraction of a chapter's own progress, each of its three
 * visual beats begins. Shared by the scroll timeline (when a beat fades
 * in) and the caption logic (which beat is current), so they cannot drift.
 */
export const wayBeatStarts = [0, 0.2, 0.55] as const

/** Which chapter (0-based) is current at a normalized 0→1 progress. */
export function getWayChapterIndex(progress: number, chapterCount: number): number {
  return Math.min(chapterCount - 1, Math.max(0, Math.floor(progress * chapterCount)))
}

/** Which beat (0–2) is current at a normalized 0→1 progress. */
export function getWayBeatIndex(progress: number, chapterCount: number): number {
  const local = progress * chapterCount - getWayChapterIndex(progress, chapterCount)
  if (local >= wayBeatStarts[2]) return 2
  if (local >= wayBeatStarts[1]) return 1
  return 0
}
