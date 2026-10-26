import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import styles from './OurStorySection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * Our Story — the client-supplied story copy (it answers the "Our story" line of the client review
 * sheet, docs/website-changes-for-client-review.xlsx). Text only, set in the editorial style of the
 * other sections, with the Visakram logo as a faint watermark behind it (a CSS background, see the
 * stylesheet). It follows "Turning Land into Legacy" (the From Plan to Place section) on the homepage.
 */
export function OurStorySection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section id="our-story" className={styles.section} aria-labelledby="our-story-heading">
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <Heading as="h2" id="our-story-heading" className={styles.heading}>
            The Story Beneath Every Landmark.
          </Heading>
          <p className={styles.tagline}>Turning Land into Legacy.</p>

          <p className={styles.lead}>
            Every piece of land holds a possibility. Every possibility begins with a vision.
          </p>

          <div className={styles.body}>
            <p>
              At Visakram Builders, we believe development is more than transforming land into
              structures. It is about creating meaningful spaces, inspiring communities, and
              building enduring value.
            </p>
            <p>
              Rooted in Andhra Pradesh and driven by progressive thinking, we bring together
              architectural vision, thoughtful planning, and a commitment to quality to shape
              developments designed for today and generations to come.
            </p>
          </div>

          <p className={styles.closing}>
            Because we don&rsquo;t simply build on land. We build what it can become.
          </p>
        </div>
      </Container>
    </section>
  )
}
