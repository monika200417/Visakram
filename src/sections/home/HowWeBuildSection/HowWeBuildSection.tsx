import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { processSteps } from '../../../data/process'
import { useProcessReveal } from './useProcessReveal'
import styles from './HowWeBuildSection.module.css'

/**
 * Chapter 08 — How We Build
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §08). An editorial
 * process sequence — horizontal on desktop, a natural vertical list on
 * mobile via CSS alone — not a numbered card grid.
 */
export function HowWeBuildSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useProcessReveal(sectionRef)

  return (
    <section
      id="how-we-build"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="how-we-build-heading"
    >
      <Container>
        <p className={`text-mono-label ${styles.eyebrow}`}>08 — How We Build</p>
        <h2 id="how-we-build-heading" className={styles.heading}>
          How we build.
        </h2>

        <ol className={styles.steps}>
          {processSteps.map((step) => (
            <li key={step.title} className={styles.step} data-step>
              <span className={`text-mono-label ${styles.index}`}>{step.index}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
