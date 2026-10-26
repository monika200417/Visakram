/**
 * Imagery for the homepage "What We Build" rows that have no video of their own
 * (a service's `video`, in data/services.ts, wins where it exists — Apartments). These are
 * stock architectural photographs, shown so the layout can be reviewed with real imagery
 * (public/assets/home-media/README.md); they are not photographs of Visakram projects.
 * Replace them with approved project photography before launch.
 */
export type HomeMediaImage = {
  src: string
  alt: string
}

export const homeBuildImages: Readonly<Record<string, HomeMediaImage>> = {
  villas: {
    src: '/assets/home-media/villas.jpg',
    alt: 'A modern luxury villa with clean lines, a glazed terrace and a pool, in warm daylight',
  },
  'residential-construction': {
    src: '/assets/home-media/residential-card.png',
    alt: 'A two-storey house under construction, with bamboo scaffolding around its walls on a sunny day',
  },
}
