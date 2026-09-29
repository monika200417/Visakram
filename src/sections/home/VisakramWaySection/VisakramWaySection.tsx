import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { visakramWayPrinciples } from '../../../data/visakramWay'
import { useVisakramWayScrub } from './useVisakramWayScrub'
import styles from './VisakramWaySection.module.css'

/**
 * Chapter 06 — The Visakram Way
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §06). A sequential
 * composition around the three verified company values, not a three-card
 * feature grid. The "visual" here is purely typographic (index + name) —
 * no photography is needed or implied, so there is nothing to placeholder.
 */
export function VisakramWaySection() {
  const sectionRef = useRef<HTMLElement>(null)
  useVisakramWayScrub(sectionRef)

  return (
    <section
      id="visakram-way"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="visakram-way-heading"
    >
      <Container className={styles.container}>
        <p className={`text-mono-label ${styles.eyebrow}`}>06 — The Visakram Way</p>
        <h2 id="visakram-way-heading" className={styles.heading}>
          The Visakram Way
        </h2>

        <div className={styles.stage}>
          <div className={styles.visual} aria-hidden="true">
            {visakramWayPrinciples.map((principle) => (
              <div key={principle.title} className={styles.visualLayer} data-way-layer>
                <span className={styles.visualIndex}>{principle.index}</span>
                <span className={styles.visualTitle}>{principle.title}</span>
              </div>
            ))}
          </div>

          <ol className={styles.list}>
            {visakramWayPrinciples.map((principle) => (
              <li key={principle.title} className={styles.item} data-way-item>
                <span className={`text-mono-label ${styles.itemIndex}`}>{principle.index}</span>
                <h3 className={styles.itemTitle}>{principle.title}</h3>
                <p className={styles.itemDescription}>{principle.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
