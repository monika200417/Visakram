import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { site } from '../../../data/site'
import styles from './ProofSection.module.css'

const stats = [
  { value: site.stats.yearsExperience, label: 'Years of experience' },
  { value: site.stats.completedProjects, label: 'Completed projects' },
  { value: String(site.stats.ongoingProjects), label: 'Ongoing projects' },
] as const

/**
 * Chapter 03 — Proof preview. Verified facts only (src/data/site.ts).
 * Deliberately not a statistics card grid (Milestone 3 spec §16) — an
 * architectural row with thin dividing rules instead. No animated counting:
 * numbers reveal once, unanimated, per docs/ANIMATION-SYSTEM.md §11.
 */
export function ProofSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 16 })

  return (
    <section className={styles.section} aria-label="Visakram Builders in numbers">
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <p className="text-mono-label">03 — Proof</p>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.value}>{stat.value}</dt>
                <dd className={styles.label}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
