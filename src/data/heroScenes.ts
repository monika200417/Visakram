/**
 * Data for the hero's layered scene sequence ("Image Transition Concept" —
 * Milestone 3 spec §6). No real architectural photography exists yet, so
 * every scene's `image` stays undefined; HeroVisualStage renders a clearly
 * marked dev placeholder instead of it (components/media/DevScenePlaceholder).
 * Drop a real `image` (or later `video`) into a scene here when supplied —
 * no component rewrite required for one image, several layered images, an
 * image sequence, or eventually video.
 */
export type HeroScene = {
  id: string
  chapter: string
  title: string
  image?: string
  video?: string
}

export const heroScenes: readonly HeroScene[] = [
  { id: 'arrival', chapter: '01', title: 'Exterior — Arrival' },
  { id: 'threshold', chapter: '02', title: 'Entrance — Threshold' },
  { id: 'interior', chapter: '03', title: 'Living — Interior' },
  { id: 'detail', chapter: '04', title: 'Architectural Detail' },
  { id: 'complete', chapter: '05', title: 'Completed Space' },
]
