import { Link } from 'react-router-dom'
import type { Testimonial } from '../../data/testimonials'
import { getProjectBySlug } from '../../data/projects'
import styles from './TestimonialCard.module.css'

type TestimonialCardProps = {
  testimonial: Testimonial
}

/**
 * Reusable customer-story presentation (Milestone 8,
 * docs/DESIGN-SYSTEM.md §13 / docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md
 * Chapter 11). Semantic figure/blockquote/figcaption structure — an
 * editorial quotation, not a review-site card. Renders only the fields
 * this testimonial actually has; nothing here is invented.
 *
 * Video is the blueprint's preferred format and takes priority when
 * present; a customer photo is the secondary option; with neither, the
 * quote stands alone as large typography. A `project` reference is
 * resolved against the real project data and only becomes a link when
 * that project actually exists — never a broken link to a removed or
 * unrecognized slug.
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const project = testimonial.project ? getProjectBySlug(testimonial.project) : undefined

  return (
    <figure className={styles.card}>
      {testimonial.video ? (
        <div className={styles.media}>
          <video
            className={styles.videoEl}
            controls
            preload="none"
            poster={testimonial.video.poster}
            aria-label={testimonial.video.alt ?? `${testimonial.customerName} video testimonial`}
          >
            <source src={testimonial.video.src} />
          </video>
        </div>
      ) : testimonial.image ? (
        <div className={styles.media}>
          <img
            src={testimonial.image.src}
            alt={testimonial.image.alt}
            className={styles.photo}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className={styles.text}>
        <blockquote className={styles.quote}>
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>

        <figcaption className={styles.meta}>
          <span className={styles.name}>{testimonial.customerName}</span>
          {testimonial.role ? <span className={styles.role}>{testimonial.role}</span> : null}
          {project ? (
            <Link to={`/projects/${project.slug}`} className={styles.projectLink}>
              {project.name}
            </Link>
          ) : null}
          {testimonial.location ? (
            <span className={styles.location}>{testimonial.location}</span>
          ) : null}
          {testimonial.rating !== undefined ? (
            <span className={styles.rating}>{testimonial.rating} / 5</span>
          ) : null}
        </figcaption>
      </div>
    </figure>
  )
}
