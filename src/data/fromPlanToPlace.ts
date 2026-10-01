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

/**
 * Upper bound (exclusive, on the normalized 0→1 scene progress) of each
 * stage in `fromPlanToPlaceStages`, in order. PLAN 0–0.15, FOUNDATION
 * 0.15–0.30, STRUCTURE 0.30–0.50, FLOORS 0.50–0.65, FACADE 0.65–0.85,
 * PLACE 0.85–1.
 */
export const fromPlanToPlaceStageEnds: readonly number[] = [0.15, 0.3, 0.5, 0.65, 0.85, 1]

/** Which stage is current at a given normalized scene progress. */
export function getActiveStageIndex(progress: number): number {
  const last = fromPlanToPlaceStageEnds.length - 1
  for (let i = 0; i < last; i++) {
    if (progress < (fromPlanToPlaceStageEnds[i] ?? 1)) return i
  }
  return last
}

/**
 * Required wherever this chapter's visual is rendered
 * (Milestone 10 §6 — "This is NOT a real Visakram project reconstruction").
 * The scene is a procedural architectural massing study, not a
 * reconstruction of any named, located or dated Visakram project.
 */
export const fromPlanToPlaceDisclaimer =
  'An illustrative construction sequence — a conceptual massing study, not a rendering of a specific Visakram Builders project.'
