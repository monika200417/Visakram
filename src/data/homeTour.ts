export type HomeTourChapter = {
  /** Stable id — also the id of the media entry that carries the chapter's footage. */
  id: string
  index: string
  title: string
  caption: string
}

/**
 * Home Tour — the nine editorial chapters of ONE villa, in the order the tour
 * visits them. This is copy only: which chapters currently have footage, and
 * where their clips and posters live, is src/media/home-tour/manifest.ts, so
 * production media can be swapped in without touching this file or the section.
 * Titles and captions are the approved editorial lines; nothing here is a claim
 * about any Visakram project, and the villa is deliberately unbranded (see
 * `homeTourDisclaimer`). No media or 3D code is imported here, so it can ship
 * in the main bundle for the static fallback and the overlay.
 */
export const homeTourChapters: readonly HomeTourChapter[] = [
  {
    id: 'exterior',
    index: '01',
    title: 'Exterior',
    caption: 'A first impression, shaped by light and proportion.',
  },
  {
    id: 'entry',
    index: '02',
    title: 'Entry',
    caption: 'A considered arrival begins at the threshold.',
  },
  {
    id: 'living',
    index: '03',
    title: 'Living',
    caption: 'Open spaces designed for everyday moments.',
  },
  { id: 'dining', index: '04', title: 'Dining', caption: 'Where spaces come together.' },
  {
    id: 'kitchen',
    index: '05',
    title: 'Kitchen',
    caption: 'Function, refined for modern living.',
  },
  {
    id: 'staircase',
    index: '06',
    title: 'Staircase',
    caption: 'A transition between levels, designed as architecture.',
  },
  {
    id: 'bedroom',
    index: '07',
    title: 'Bedroom',
    caption: 'A quieter space to slow down.',
  },
  {
    id: 'balcony',
    index: '08',
    title: 'Balcony',
    caption: 'An open connection to the world beyond.',
  },
  {
    id: 'reveal',
    index: '09',
    title: 'Final Reveal',
    caption: 'The complete home, seen as one composition.',
  },
]

export const homeTourHeading = 'Home Tour'
export const homeTourTagline = 'Experience spaces beyond walls.'

/**
 * Required wherever the tour is rendered. The residence is an illustrative
 * property tour — not a Visakram project, not a real address, and intentionally
 * carrying no signage or brand mark.
 */
export const homeTourDisclaimer =
  'An illustrative residence — a conceptual architectural study, not a specific Visakram Builders project.'
