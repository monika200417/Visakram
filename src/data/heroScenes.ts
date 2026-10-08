/**
 * The hero film's chapters ("Image Transition Concept" — Milestone 3 spec §6).
 * The film itself is the frame sequence in heroFilm.ts; a scene is only a time
 * range of it, used for the small chapter caption that changes as the visitor
 * scrolls. `start` is the normalized progress (0–1) where the scene begins; it
 * runs until the next one starts. The ranges were read off the footage: the
 * exterior (0–1.9 s), the entrance into the living space (1.9–3.6 s), then the
 * living space itself (3.6–7.1 s).
 */
export type HeroScene = {
  id: string
  chapter: string
  /** Full descriptive name (also used by the dev placeholder). */
  title: string
  /** The short word shown in the hero caption. */
  caption: string
  /** Progress through the hero film (0–1) where this scene begins. */
  start: number
}

export const heroScenes: readonly HeroScene[] = [
  { id: 'arrival', chapter: '01', title: 'Exterior — Arrival', caption: 'Arrival', start: 0 },
  {
    id: 'threshold',
    chapter: '02',
    title: 'Entrance — Threshold',
    caption: 'Threshold',
    start: 0.27,
  },
  { id: 'interior', chapter: '03', title: 'Living — Interior', caption: 'Home', start: 0.51 },
]

/** The scene showing at a normalized progress value. Boundaries belong to the scene they begin. */
export function heroSceneIndexAtProgress(
  progress: number,
  scenes: readonly HeroScene[] = heroScenes,
): number {
  let active = 0
  for (let i = 0; i < scenes.length; i += 1) {
    if (progress >= scenes[i]!.start) active = i
  }
  return active
}
