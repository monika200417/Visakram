import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { TestimonialCard } from '../../../components/testimonial/TestimonialCard'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { testimonials } from '../../../data/testimonials'
import styles from './CustomerStoriesSection.module.css'

/**
 * Chapter 11 — Customer Stories
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 11).
 * Chapters 09 (Project Archive) and 10 (Founders) became their own pages
 * rather than homepage chapters, so this follows directly after Chapter 08
 * (How We Build) in the homepage's on-page numbering, matching how that
 * section already skips 07 for the same reason.
 *
 * `testimonials` is empty until the client supplies and approves real
 * customer material — no placeholder quote, name, rating or stock photo
 * is ever shown. A simple vertical stack (no carousel) scales fine for
 * however many real testimonials eventually land here; the blueprint
 * itself warns against a "generic testimonial carousel with tiny cards."
 */
export function CustomerStoriesSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section
      id="customer-stories"
      className={styles.section}
      aria-labelledby="customer-stories-heading"
    >
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <p className={`text-mono-label ${styles.eyebrow}`}>11 — Customer Stories</p>
          <h2 id="customer-stories-heading" className={styles.heading}>
            Customer stories.
          </h2>

          {testimonials.length > 0 ? (
            <ul className={styles.list}>
              {testimonials.map((testimonial) => (
                <li key={testimonial.id} className={styles.item}>
                  <TestimonialCard testimonial={testimonial} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.pending} data-dev-placeholder>
              Awaiting approved customer stories. This space is built to carry a customer&rsquo;s
              name, project, location and quote — with video where supplied — as soon as one is
              confirmed. No testimonial is shown here until then.
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}
