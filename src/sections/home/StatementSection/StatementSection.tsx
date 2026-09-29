import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { site } from '../../../data/site'
import { formatList } from '../../../utils/formatList'
import styles from './StatementSection.module.css'

/** Chapter 02 — Statement (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §05). */
export function StatementSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef)

  return (
    <section id="statement" className={styles.section} aria-labelledby="statement-heading">
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <p className={`text-mono-label ${styles.eyebrow}`}>02 — Statement</p>
          <h2 id="statement-heading" className={styles.heading}>
            We turn plans, materials and construction expertise into spaces people can inhabit.
          </h2>
          <p className={styles.supporting}>
            {site.name} is a residential construction company based in {site.locality}, {site.city},
            building across {formatList(site.serviceAreas)} — guided by{' '}
            {formatList(site.values).toLowerCase()} at every stage.
          </p>
        </div>
      </Container>
    </section>
  )
}
