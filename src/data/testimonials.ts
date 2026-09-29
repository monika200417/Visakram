import { assertUniqueIdentifiers } from './validate'

/** A single customer photo with the alt text it needs to be accessible on its own. */
export type TestimonialImage = {
  src: string
  alt: string
}

/** A single testimonial video, with an optional poster frame shown before playback. */
export type TestimonialVideo = {
  src: string
  poster?: string
  alt?: string
}

export type Testimonial = {
  id: string
  customerName: string
  quote: string
  /** The project this testimonial refers to, if any (matches Project['slug']).
   *  A reference only — never the project's own data duplicated here. */
  project?: string
  /** Verified customer location, if supplied — never inferred from a
   *  service area (docs/DESIGN-SYSTEM.md §13). */
  location?: string
  /** Verified descriptor if supplied (e.g. "Homeowner") — never invented. */
  role?: string
  /** ISO date string, only when the client supplies one. */
  date?: string
  /**
   * Only ever set from a real, supplied rating — never invented or
   * defaulted. Rendered as understated text, never a star widget
   * (docs/DESIGN-SYSTEM.md §13 — avoid star-rating-heavy UI).
   */
  rating?: number
  image?: TestimonialImage
  video?: TestimonialVideo
}

/**
 * No customer testimonial has been supplied or approved yet
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 11 /
 * Milestone 5 §9). This stays empty — never a placeholder quote, name,
 * rating, review count or stock photo — until the client provides and
 * approves real testimonials.
 */
export const testimonials: readonly Testimonial[] = []

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(testimonials, 'id', 'testimonials')
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.id === id)
}
