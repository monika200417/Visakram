import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { site } from '../../../data/site'
import { formatList } from '../../../utils/formatList'
import styles from './LocalPresenceSection.module.css'

/**
 * Chapter 12 — Local Presence
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 12: reinforce
 * service geography; "no unnecessarily heavy interactive map"). An editorial,
 * typographic treatment of the verified geography in src/data/site.ts only —
 * where Visakram Builders is based and the areas it builds across. There is
 * deliberately no map, marker position, distance, office or per-area figure:
 * none of that is in the data, and a drawn map would imply it.
 */
export function LocalPresenceSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section
      id="local-presence"
      className={styles.section}
      aria-labelledby="local-presence-heading"
    >
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <div className={styles.lead}>
            <p className={`text-mono-label ${styles.eyebrow}`}>12 — Local Presence</p>
            <h2 id="local-presence-heading" className={styles.heading}>
              Building across {formatList(site.serviceAreas)}.
            </h2>
          </div>

          <dl className={styles.facts}>
            <div className={styles.row}>
              <dt className={`text-mono-label ${styles.term}`}>Based in</dt>
              <dd className={styles.based}>
                <span className={styles.basedPrimary}>
                  {site.locality}, {site.city}
                </span>
                <span className={styles.basedSecondary}>{site.region}</span>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={`text-mono-label ${styles.term}`}>Building across</dt>
              <dd className={styles.areasCell}>
                <ol className={styles.areas}>
                  {site.serviceAreas.map((area, i) => (
                    <li key={area} className={styles.area}>
                      <span className={`text-mono-label ${styles.index}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.areaName}>{area}</span>
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  )
}
