import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { getWayVisual, visakramWayPrinciples } from '../../../data/visakramWay'
import { useVisakramWayScrub } from './useVisakramWayScrub'
import { WayVisual } from './WayVisual'
import styles from './VisakramWaySection.module.css'

/**
 * Chapter 06 — The Visakram Way
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §06;
 * docs/ANIMATION-SYSTEM.md §14). "Three principles. One architectural
 * story." — the three verified company values told as one continuous,
 * scroll-driven visual narrative rather than a card grid.
 *
 * The three principles (title + description) always exist as real HTML.
 * On desktop with motion allowed, `.pinned` (~100svh) is pinned by
 * useVisakramWayScrub while a conceptual linework visual (left, ~55%) and
 * a single active principle (right, ~45%) advance together from one
 * normalized progress value. Mobile and reduced motion keep the plain,
 * fully-visible vertical list — no visual, no pin.
 *
 * The visuals are procedural/illustrative (WayVisual). Real client media can
 * later be supplied per chapter via `asset` in src/data/visakramWay.ts.
 */
export function VisakramWaySection() {
  const pinnedRef = useRef<HTMLDivElement>(null)
  useVisakramWayScrub(pinnedRef)

  return (
    <section id="visakram-way" className={styles.section} aria-labelledby="visakram-way-heading">
      <div ref={pinnedRef} className={styles.pinned}>
        <Container className={styles.container}>
          <div className={styles.stage}>
            <div className={styles.visual} aria-hidden="true">
              {visakramWayPrinciples.map((principle) => (
                <WayVisual key={principle.title} visual={getWayVisual(principle.title)} />
              ))}
            </div>

            <div className={styles.copy}>
              <div className={styles.head}>
                <p className={`text-mono-label ${styles.eyebrow}`}>06 — The Visakram Way</p>
                <h2 id="visakram-way-heading" className={styles.heading}>
                  The Visakram Way
                </h2>
                <p className={styles.tagline}>Three principles. One architectural story.</p>
              </div>

              <ol className={styles.list} data-way-list>
                {visakramWayPrinciples.map((principle) => (
                  <li key={principle.title} className={styles.item} data-way-item>
                    <span className={`text-mono-label ${styles.itemIndex}`}>{principle.index}</span>
                    <h3 className={styles.itemTitle}>{principle.title}</h3>
                    <p className={styles.itemDescription}>{principle.description}</p>
                  </li>
                ))}
              </ol>

              <div className={styles.meta} aria-hidden="true">
                <ol className={styles.nav}>
                  {visakramWayPrinciples.map((principle, index) => (
                    <li
                      key={principle.title}
                      className={styles.navItem}
                      data-way-nav
                      data-active={index === 0}
                    >
                      {principle.index} {principle.title}
                    </li>
                  ))}
                </ol>
                <div className={styles.track}>
                  <div className={styles.fill} data-way-fill />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
