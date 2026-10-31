import { assertUniqueIdentifiers } from './validate'
import type { Project } from './projects'

/**
 * A silent, looping video for a service's media area. It is shown whole inside
 * the existing media box at its own proportions (portrait stays portrait), never
 * cropped or stretched.
 */
export type ServiceVideo = {
  src: string
  /** A still shown until playback starts, and kept if it never does. */
  poster?: string
  /** Accessible description, supplied with the video. Without one it is decorative. */
  alt?: string
}

export type Service = {
  slug: string
  index: string
  /** Matches Project['category'] so a project can key back to its service. */
  category: Project['category']
  /** The service's name everywhere on the site (Home, About, the project filter, the contact form). */
  title: string
  /** The heading used on the /services page itself, where it differs from `title`. */
  pageTitle?: string
  /** Used on the homepage "What We Build" chapter — keep it to one line. */
  shortDescription: string
  /** Reserved for the future /services page. Left undefined until the
   *  client approves longer copy — a short, honest description beats a
   *  padded-out invented one. */
  description?: string
  image?: string
  /** Alt text for `image`, supplied with it. Without one the image is
   *  rendered as decorative (empty alt) rather than given invented text. */
  imageAlt?: string
  /** Shown in place of `image` when present. */
  video?: ServiceVideo
  highlights?: string[]
}

/**
 * The three verified service categories
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §03 "Primary
 * services"). Ordered to match the existing homepage "What We Build"
 * chapter (§04 of the same document uses this Villas → Apartments →
 * Residential Construction order; the Brand System section lists the same
 * three in a different order for general reference — the homepage's
 * existing, shipped order is preserved here so wiring it to this file
 * changes nothing visually).
 */
export const services: readonly Service[] = [
  {
    slug: 'villas',
    index: '01',
    category: 'villa',
    title: 'Villas',
    shortDescription:
      'Independent homes built end-to-end — from foundation to finish — for families building the place they will live in.',
    image: '/assets/images/projects-page/villa-dusk.webp',
    imageAlt:
      'A contemporary villa with tall glazed walls, lit from within at dusk, behind a planted garden',
  },
  {
    slug: 'apartments',
    index: '02',
    category: 'apartment',
    title: 'Apartments',
    pageTitle: 'Apartments & High-Rise',
    shortDescription:
      'Multi-unit residential buildings, held to the same standard of oversight and finish as a single home.',
    video: { src: '/assets/videos/apartments-highraise.mp4' },
  },
  {
    slug: 'residential-construction',
    index: '03',
    category: 'residential',
    title: 'Residential Construction',
    shortDescription:
      'Ground-up residential construction across Visakhapatnam and Vizianagaram, built to the client’s own plan and timeline.',
    image: '/assets/images/projects-page/construction-timber-frame.webp',
    imageAlt:
      'The timber frame and roof of a two-storey house under construction, with scaffolding along its eaves',
  },
]

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(services, 'slug', 'services')
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export function getServiceByCategory(category: Project['category']): Service | undefined {
  return services.find((service) => service.category === category)
}
