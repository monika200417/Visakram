import { assertUniqueIdentifiers } from './validate'

/**
 * The four segments shown as cards in the homepage "What We Build" carousel, each with the
 * client-supplied tagline. Only the segment name and its tagline are given, so the card carries
 * nothing else — no description, project count or claim. These are homepage cards only; the
 * /services page and the project filters still use src/data/services.ts.
 *
 * Residential keeps the looping apartments video that was on the Apartments card. Commercial and
 * Mixed-use have no supplied imagery yet, so they use stock / placeholder pictures that are not of
 * Visakram projects (public/assets/home-media/README.md): replace them with approved photography.
 * Hospitality's heading and tagline were written to match the other three ("Spaces to …"); the
 * client has not supplied them, so confirm the wording.
 */
export type HomeSegment = {
  slug: string
  index: string
  title: string
  tagline: string
  video?: { src: string; poster?: string; alt?: string }
  image?: { src: string; alt: string }
}

export const homeSegments: readonly HomeSegment[] = [
  {
    slug: 'residential',
    index: '01',
    title: 'Residential',
    tagline: 'Spaces to Live.',
    video: { src: '/assets/videos/apartments-highraise.mp4' },
  },
  {
    slug: 'commercial',
    index: '02',
    title: 'Commercial',
    tagline: 'Spaces to Thrive.',
    image: {
      src: '/assets/testimonials/04-tower-glass.jpg',
      alt: 'Glass office towers seen from the street, rising into a pale sky',
    },
  },
  {
    slug: 'mixed-use',
    index: '03',
    title: 'Mixed-use',
    tagline: 'Spaces to Connect.',
    image: {
      src: '/assets/eagle-hero/hero-city.webp',
      alt: 'A tall building above a coastal city at sunrise, with the sea and streets below',
    },
  },
  {
    slug: 'hospitality',
    index: '04',
    title: 'Hospitality',
    tagline: 'Spaces to Unwind.',
    image: {
      src: '/assets/testimonials/08-pool-house.jpg',
      alt: 'A modern white resort-style building with glass balconies beside a turquoise pool, under a blue sky',
    },
  },
]

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(homeSegments, 'slug', 'home segments')
}
