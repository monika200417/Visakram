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

export type WayStage = {
  label: string
  /** Where this stage begins, as a 0–1 fraction of its own chapter's progress. */
  start: number
}

export type WayChapterVisual = {
  motif: WayMotif
  /** The visual story told inside this chapter, in order. */
  stages: readonly WayStage[]
  /**
   * Optional real client-provided media. When set, WayVisual renders it in
   * place of the conceptual rendered plate (the shaded SVG architecture),
   * inside the same layer, while the gold technical overlay (dimensions,
   * callouts, datum) stays on top — so swapping in photographs, renders or
   * video needs no change to the storytelling architecture or animation.
   */
  asset?: WayAsset
}

/**
 * Stage starts per chapter, shared by the SVG visuals (when each stage's
 * artwork reveals), the caption row and the scroll hook (which stage is
 * current), so they cannot drift apart. Fractions of the chapter's own
 * progress; the chapter itself is one third of the pinned scroll.
 */
export const wayStageStarts = {
  quality: [0, 0.2, 0.45, 0.7],
  timeliness: [0, 0.2, 0.4, 0.6, 0.8],
  transparency: [0, 0.2, 0.4, 0.6, 0.8],
} as const satisfies Record<WayMotif, readonly number[]>

/** Chapter-local progress at which every chapter's final light and finish resolve. */
export const wayResolveAt = 0.9

function stagesOf(motif: WayMotif, labels: readonly string[]): readonly WayStage[] {
  return labels.map((label, i) => ({ label, start: wayStageStarts[motif][i] ?? 0 }))
}

/**
 * Conceptual visual narrative per principle, keyed by principle title. The
 * procedural visuals are illustrative treatments — not depictions of any
 * actual Visakram project, and they carry no capability claims.
 */
const visuals: Record<string, WayChapterVisual> = {
  Quality: {
    motif: 'quality',
    stages: stagesOf('quality', ['Material', 'Structural precision', 'Craftsmanship', 'Finish']),
  },
  Timeliness: {
    motif: 'timeliness',
    stages: stagesOf('timeliness', ['Foundation', 'Structure', 'Floors', 'Envelope', 'Completion']),
  },
  Transparency: {
    motif: 'transparency',
    stages: stagesOf('transparency', [
      'Plan',
      'Structure',
      'Walls & envelope',
      'Materials & facade',
      'Finished space',
    ]),
  },
}

export function getWayVisual(title: string): WayChapterVisual {
  return visuals[title] ?? { motif: 'quality', stages: [] }
}

/** Which chapter (0-based) is current at a normalized 0→1 progress. */
export function getWayChapterIndex(progress: number, chapterCount: number): number {
  return Math.min(chapterCount - 1, Math.max(0, Math.floor(progress * chapterCount)))
}

/** Which stage of its chapter is current at a normalized 0→1 progress. */
export function getWayStageIndex(
  progress: number,
  chapterCount: number,
  stages: readonly WayStage[],
): number {
  const local = progress * chapterCount - getWayChapterIndex(progress, chapterCount)
  let index = 0
  stages.forEach((stage, i) => {
    if (local >= stage.start) index = i
  })
  return index
}
