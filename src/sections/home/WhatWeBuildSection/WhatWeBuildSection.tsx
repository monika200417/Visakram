import { services } from '../../../data/services'
import { Container } from '../../../components/layout/Container'
import { BuildCategoryRow } from './BuildCategoryRow'
import styles from './WhatWeBuildSection.module.css'

/**
 * Chapter 04 — What We Build
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §05). Three large
 * editorial rows, alternating image side, deliberately not a card grid.
 * Content comes from src/data/services.ts. Imagery is a development
 * placeholder throughout — see DevImagePlaceholder.
 */
export function WhatWeBuildSection() {
  return (
    <section id="what-we-build" className={styles.section} aria-labelledby="what-we-build-heading">
      <Container>
        <p className={`text-mono-label ${styles.eyebrow}`}>04 — What We Build</p>
        <h2 id="what-we-build-heading" className={styles.heading}>
          What we build.
        </h2>
        <ul className={styles.list}>
          {services.map((service, i) => (
            <BuildCategoryRow
              key={service.slug}
              category={service}
              align={i % 2 === 0 ? 'start' : 'end'}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
