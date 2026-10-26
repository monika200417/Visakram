export type FromPlanToPlaceStage = {
  index: string
  title: string
  description: string
}

/**
 * Chapter 07 — From Plan to Place
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §07;
 * docs/ANIMATION-SYSTEM.md §15). Six fixed construction-process stages —
 * generic and educational, describing how a residential build generally
 * proceeds. Deliberately not tied to any named project, location, date or
 * statistic (see `fromPlanToPlaceDisclaimer` below).
 */
export const fromPlanToPlaceStages: readonly FromPlanToPlaceStage[] = [
  {
    index: '01',
    title: 'Plan',
    description:
      'An architectural idea becomes a plan — grid lines and levels set the discipline everything else will follow.',
  },
  {
    index: '02',
    title: 'Foundation',
    description:
      'The ground is prepared and the foundation is laid — the base everything above will depend on.',
  },
  {
    index: '03',
    title: 'Structure',
    description:
      "Columns rise and beams connect them, establishing the building's load-bearing frame.",
  },
  {
    index: '04',
    title: 'Floors',
    description: "Floor by floor, the building's levels take shape.",
  },
  {
    index: '05',
    title: 'Facade',
    description:
      'Walls enclose the frame, and openings, balconies and fins give the building its outward architectural character.',
  },
  {
    index: '06',
    title: 'Place',
    description: 'Plan, structure and finish come together as a completed building.',
  },
]

/** The editorial introduction to the chapter, shown exactly as written. */
export const fromPlanToPlaceCaption =
  'How raw blueprints transform into living spaces: an illustrative walkthrough of our delivery methodology.'

/**
 * The chapter's visual: one supplied walkthrough video that autoplays on a loop, silent.
 * It is the original file, played as-is — never scrubbed, never cut into frames. The poster
 * is the video's own first frame (a 1280×720 WebP, ~50 KB), shown until the video plays and
 * wherever it does not (reduced motion).
 */
export const fromPlanToPlaceVideo = {
  src: '/assets/videos/plan-to-place.mp4',
  poster: '/assets/videos/plan-to-place-poster.webp',
  width: 1280,
  height: 720,
  /** Accessible name: what it is, not what any one frame shows. */
  label:
    'An illustrative walkthrough of a building taking shape, from a site plan to a completed tower.',
} as const

/**
 * Upper bound (exclusive, on the normalized 0→1 scroll progress through the pinned
 * chapter) of each stage in `fromPlanToPlaceStages`, in order: six equal parts, so each
 * methodology stage is emphasised for the same stretch of scroll.
 */
export const fromPlanToPlaceStageEnds: readonly number[] = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]

/** Which stage is current at a given normalized scroll progress. */
export function getActiveStageIndex(progress: number): number {
  const last = fromPlanToPlaceStageEnds.length - 1
  for (let i = 0; i < last; i++) {
    if (progress < (fromPlanToPlaceStageEnds[i] ?? 1)) return i
  }
  return last
}

/**
 * Required wherever this chapter's visual is rendered. The walkthrough is an illustrative
 * construction sequence, not a depiction of any named, located or dated Visakram project.
 */
export const fromPlanToPlaceDisclaimer =
  'An illustrative construction sequence — not a depiction of a specific Visakram Builders project.'
