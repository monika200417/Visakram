import { assertUniqueIdentifiers } from './validate'
import type { Project } from './projects'

export type Service = {
  slug: string
  index: string
  /** Matches Project['category'] so a project can key back to its service. */
  category: Project['category']
  title: string
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
  },
  {
    slug: 'apartments',
    index: '02',
    category: 'apartment',
    title: 'Apartments',
    shortDescription:
      'Multi-unit residential buildings, held to the same standard of oversight and finish as a single home.',
  },
  {
    slug: 'residential-construction',
    index: '03',
    category: 'residential',
    title: 'Residential Construction',
    shortDescription:
      'Ground-up residential construction across Visakhapatnam and Vizianagaram, built to the client’s own plan and timeline.',
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
