import type { HomeTourChapter } from '../../../data/homeTour'

/** Legacy procedural-villa chapters (kept only until the procedural Home Tour is removed). */
export const villaChapters: readonly HomeTourChapter[] = [
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
  {
    id: 'diningKitchen',
    index: '04',
    title: 'Dining + Kitchen',
    caption: 'Where spaces come together, refined for modern living.',
  },
  {
    id: 'staircase',
    index: '05',
    title: 'Staircase',
    caption: 'A transition between levels, designed as architecture.',
  },
  {
    id: 'bedroom',
    index: '06',
    title: 'Bedroom',
    caption: 'A quieter space to slow down.',
  },
  {
    id: 'terrace',
    index: '07',
    title: 'Ocean Terrace',
    caption: 'An open connection to the ocean beyond.',
  },
  {
    id: 'reveal',
    index: '08',
    title: 'Final Reveal',
    caption: 'The complete home, seen as one composition.',
  },
]
