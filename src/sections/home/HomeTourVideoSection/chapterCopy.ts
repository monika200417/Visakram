/**
 * The short editorial line shown under each Home Tour chapter title, keyed by
 * the chapter `id` from data/homeTourFilm.ts. Presentation copy only — the
 * chapter list, order and timings stay in the film data.
 */
export const homeTourChapterCopy: Readonly<Record<string, string>> = {
  living: 'Natural light, generous volume and a quiet sense of permanence.',
  kitchen: 'Functional planning meets a refined, contemporary material palette.',
  staircase: 'A sculptural transition connecting the private and social spaces.',
  hallway: 'Clean circulation that connects each space with intention.',
  bedroom: 'A private retreat defined by warmth, proportion and natural light.',
  balcony: 'An open edge where the interior meets the coastal landscape.',
  'ocean-view': 'An uninterrupted relationship between home, horizon and sea.',
}
