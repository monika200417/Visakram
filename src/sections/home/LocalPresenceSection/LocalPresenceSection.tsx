import { useEffect, useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { Heading } from '../../../components/heading/Heading'
import { NoBreak } from '../../../components/text/NoBreak'
import { useReplayOnView } from '../../../hooks/useReplayOnView'
import styles from './LocalPresenceSection.module.css'

/**
 * Chapter 12 — Local Presence
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 12: reinforce service geography).
 * Now just the client-supplied statement — "Building Across Andhra Pradesh." and its paragraph — over
 * a translucent photograph of a site worker facing the sunrise and the cranes (a CSS background, see
 * the stylesheet). The earlier base-and-areas list (Kommadi; Visakhapatnam, Vizianagaram) was removed
 * at the client's request. No map, marker, distance, office or per-area figure appears.
 */
export function LocalPresenceSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  // the arrow slides in from the left each time its heading box comes into view (the arrow itself waits
  // off screen, so it cannot be the thing that is watched)
  const titleRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLImageElement>(null)
  useReplayOnView(titleRef, 'slide')

  /* It starts at the far left edge of the screen: --slide-from is how far left of its place that is
     (the arrow's own width plus the space to its left), kept up to date as the window changes. */
  useEffect(() => {
    const arrow = arrowRef.current
    const box = titleRef.current
    if (!arrow || !box) return
    const measure = () => {
      const from = box.getBoundingClientRect().left + arrow.offsetWidth
      arrow.style.setProperty('--slide-from', `${-Math.round(from)}px`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section
      id="local-presence"
      className={styles.section}
      aria-labelledby="local-presence-heading"
    >
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <div className={styles.lead}>
            <div ref={titleRef} className={styles.title}>
              <Heading as="h2" id="local-presence-heading" className={styles.heading}>
                Building Across Andhra Pradesh.
              </Heading>
              {/* decorative: the supplied feathered arrow, between the heading and the statement; it slides in from the left */}
              <img
                ref={arrowRef}
                className={styles.arrow}
                src="/assets/images/arrow.png"
                alt=""
                width={1865}
                height={186}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className={styles.statement}>
              Driven by visionary development, architectural innovation, and uncompromising quality,
              we create future ready spaces that shape how <NoBreak>Andhra Pradesh</NoBreak> lives,
              works, and grows.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
