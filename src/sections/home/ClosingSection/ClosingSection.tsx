import { useRef } from 'react'
import { Button } from '../../../components/buttons/Button'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { primaryCta } from '../../../data/navigation'
import { site } from '../../../data/site'
import styles from './ClosingSection.module.css'
import { Heading } from '../../../components/heading/Heading'

type ClosingImage = { src: string; alt: string }

type ClosingSectionProps = {
  /** A real, cleared image for behind the statement. Defaults to site.closingImage (unset today). */
  image?: ClosingImage
}

/**
 * Chapter 14 — Cinematic Closing
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 14: a large
 * visual, "Let's build what lasts.", then START A PROJECT, then the footer).
 * The final statement of the homepage: a full-bleed dark band that runs
 * straight into the (dark) footer. No closing image or video has been
 * supplied, so it is composed from type alone and reads complete that way;
 * when site.closingImage is set it sits behind the statement under a flat
 * tint — no code change needed. Nothing here is loaded, pinned or scrubbed.
 *
 * `data-flush-footer` tells the shared layout to drop the footer's top
 * margin for this page, which only exists to separate the footer from the
 * pale pages that end on paper (src/styles/layout.css).
 */
export function ClosingSection({ image = site.closingImage }: ClosingSectionProps) {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section
      id="closing"
      className={styles.section}
      aria-labelledby="closing-heading"
      data-flush-footer
    >
      {image ? (
        <>
          <img
            src={image.src}
            alt={image.alt}
            className={styles.photo}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.tint} aria-hidden="true" />
        </>
      ) : null}

      {/* The top of the band, in the space above the statement: a button that is not live yet. */}
      <Container className={styles.container}>
        <button type="button" className={styles.soon} disabled>
          <span>Operational segments</span>
          <span className={styles.soonTag}>Coming soon</span>
        </button>
      </Container>

      <Container className={styles.container}>
        <div ref={revealRef} className={styles.inner}>
          <Heading as="h2" id="closing-heading" className={styles.heading}>
            Let&rsquo;s build what lasts.
          </Heading>
          <div className={styles.cta}>
            <Button to={primaryCta.to} variant="primary">
              {primaryCta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
