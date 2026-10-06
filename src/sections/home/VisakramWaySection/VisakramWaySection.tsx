import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { getWayVisual, visakramWayPrinciples } from '../../../data/visakramWay'
import { useVisakramWayScrub } from './useVisakramWayScrub'
import { WayDefs } from './WayDefs'
import { WayVisual } from './WayVisual'
import styles from './VisakramWaySection.module.css'

/**
 * Chapter 06 — The Visakram Way
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §06;
 * docs/ANIMATION-SYSTEM.md §14). "Three principles. One architectural
 * story." — the three verified company values told as one continuous,
 * scroll-driven architectural film rather than a card grid.
 *
 * The three principles (title + description) always exist as real HTML.
 * On desktop with motion allowed, `.pinned` (100svh) is pinned by
 * useVisakramWayScrub: the visual fills the frame edge to edge, the editorial
 * copy sits over a left scrim, and both advance from one normalized progress
 * value. Mobile and reduced motion keep the plain, fully-visible vertical
 * list — no visual, no pin.
 *
 * The visuals are procedural/illustrative (see WayVisual). Real client media
 * can later replace each chapter's rendered plate via `asset` in
 * src/data/visakramWay.ts.
 */
export function VisakramWaySection() {
  const pinnedRef = useRef<HTMLDivElement>(null)
  useVisakramWayScrub(pinnedRef)

  return (
    <section id="visakram-way" className={styles.section} aria-labelledby="visakram-way-heading">
      <div ref={pinnedRef} className={styles.pinned}>
        <WayDefs />
        <div className={styles.visual} aria-hidden="true">
          {visakramWayPrinciples.map((principle) => (
            <WayVisual key={principle.title} visual={getWayVisual(principle.title)} />
          ))}
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        {/* One stage row per chapter, stacked in the same spot; only the active chapter's is visible. */}
        <div className={styles.stages} aria-hidden="true">
          {visakramWayPrinciples.map((principle, ci) => (
            <ol
              key={principle.title}
              className={styles.stageRow}
              data-way-stage-row
              data-active={ci === 0}
            >
              {getWayVisual(principle.title).stages.map((stage, i) => (
                <li
                  key={stage.label}
                  className={styles.stage}
                  data-way-beat-label
                  data-active={i === 0}
                >
                  <span className={styles.stageNo}>{String(i + 1).padStart(2, '0')}</span>
                  {stage.label}
                </li>
              ))}
            </ol>
          ))}
        </div>

        <Container className={styles.container}>
          <div className={styles.copy}>
            <div className={styles.head}>
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
        </Container>
      </div>
    </section>
  )
}
