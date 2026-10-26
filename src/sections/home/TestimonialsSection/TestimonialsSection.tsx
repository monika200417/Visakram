import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import {
  clientTestimonials,
  initialsOf,
  type ClientTestimonial,
} from '../../../data/clientTestimonials'
import { useMarquee } from './useMarquee'
import styles from './TestimonialsSection.module.css'
import { Heading } from '../../../components/heading/Heading'

const AVATAR_TONES = ['terracotta', 'gold', 'stone', 'paper'] as const

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className={n <= rating ? styles.starOn : styles.starOff}
          aria-hidden="true"
        >
          <path d="M10 1.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L10 14.6 4.8 17.5 6 11.7 1.6 7.7l5.9-.7z" />
        </svg>
      ))}
    </span>
  )
}

function Card({
  item,
  index,
  decorative,
}: {
  item: ClientTestimonial
  index: number
  decorative: boolean
}) {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length]
  return (
    <article
      className={styles.card}
      data-marquee-card
      // the repeated set only exists to make the loop seamless: hide it from assistive tech
      aria-hidden={decorative || undefined}
      aria-label={
        decorative ? undefined : `${item.project}, ${item.location}: review by ${item.name}`
      }
    >
      <div className={styles.media}>
        <div className={styles.frame}>
          <img
            className={styles.photo}
            src={item.image.src}
            alt={decorative ? '' : item.image.alt}
            width={1000}
            height={667}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <span className={styles.badge}>{item.buildType}</span>
        <Stars rating={item.rating} />
        <span className={`${styles.avatar} ${styles[`tone_${tone}`]}`} aria-hidden="true">
          {initialsOf(item.name)}
        </span>
      </div>

      <div className={styles.body}>
        <span className={`text-mono-label ${styles.index}`} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <blockquote className={styles.quote}>
          <p className={styles.headline}>{item.headline}</p>
          <p className={styles.feedback}>{item.feedback}</p>
        </blockquote>
        <div className={styles.foot}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.designation}>{item.designation}</span>
          <span className={styles.where}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 8.5 4.5 8.5S12.5 9.2 12.5 6A4.5 4.5 0 0 0 8 1.5zm0 6.2A1.7 1.7 0 1 1 8 4.3a1.7 1.7 0 0 1 0 3.4z" />
            </svg>
            {item.project} · {item.location}
          </span>
        </div>
        <span className={styles.rule} aria-hidden="true" />
      </div>
    </article>
  )
}

/**
 * Homepage Testimonials (11, in place of the former Customer Stories): a seamless right-to-left marquee of tall photo cards.
 * Hovering or focusing the track pauses it (with an eased stop), the arrows glide it one
 * card at a time, a pause button satisfies WCAG 2.2.2, and touch users can swipe. The
 * motion lives in useMarquee as direct transform writes, so scrolling and drifting never
 * re-render React. Reduced motion stops the drift (the arrows still step).
 *
 * The content is PREVIEW content (data/clientTestimonials.ts), flagged on the page and with
 * `data-dev-placeholder` so it is easy to find and replace before launch.
 */
export function TestimonialsSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useRevealOnScroll(revealRef, { y: 28 })

  const { step, userPaused, toggle } = useMarquee({
    viewportRef,
    trackRef,
    counterRef,
    progressRef,
    count: clientTestimonials.length,
    reducedMotion,
  })

  return (
    <section
      id="testimonials"
      className={styles.section}
      aria-labelledby="testimonials-heading"
      data-testimonials
      // sample reviews and stock photographs: marked for audit, with nothing visible on the page
      data-preview="true"
    >
      <Container>
        <div ref={revealRef} className={styles.header}>
          <div className={styles.titles}>
            <Heading as="h2" id="testimonials-heading" className={styles.heading}>
              What our clients say.
            </Heading>
            <p className={styles.sub}>
              Words from the families and owners we have built for — on time, on budget and to a
              standard they can see.
            </p>
          </div>

          <div className={styles.controls}>
            <span ref={counterRef} className={styles.counter} aria-hidden="true">
              01 / {String(clientTestimonials.length).padStart(2, '0')}
            </span>
            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.button}
                onClick={() => step(-1)}
                aria-label="Previous testimonial"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={toggle}
                aria-pressed={userPaused}
                aria-label={
                  userPaused ? 'Play testimonials auto-scroll' : 'Pause testimonials auto-scroll'
                }
              >
                {userPaused ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5l11 7-11 7z" className={styles.solid} />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14M16 5v14" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={() => step(1)}
                aria-label="Next testimonial"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>

      <div className={styles.progress} aria-hidden="true">
        <span ref={progressRef} className={styles.progressBar} />
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <div ref={trackRef} className={styles.track}>
          {clientTestimonials.map((item, index) => (
            <Card key={item.id} item={item} index={index} decorative={false} />
          ))}
          {clientTestimonials.map((item, index) => (
            <Card key={`${item.id}-repeat`} item={item} index={index} decorative />
          ))}
        </div>
      </div>
    </section>
  )
}
