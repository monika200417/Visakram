import { assertUniqueIdentifiers } from './validate'

export type Testimonial = {
  id: string
  customerName: string
  quote: string
  /** The project this testimonial refers to, if any (matches Project['slug']). */
  project?: string
  /** Verified descriptor if supplied — never invented (e.g. no star ratings). */
  role?: string
  image?: string
  video?: string
}

/**
 * No customer testimonial has been supplied or approved yet
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §11 / Milestone 5
 * §9). This stays empty — never a placeholder quote, name, rating or review
 * count — until the client provides and approves real testimonials.
 */
export const testimonials: readonly Testimonial[] = []

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(testimonials, 'id', 'testimonials')
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.id === id)
}
