import { fromPlanToPlaceStages } from '../../../data/fromPlanToPlace'
import styles from './StaticStagesVisual.module.css'

const GLYPH_CLASS = ['plan', 'foundation', 'structure', 'floors', 'facade', 'place'] as const

/**
 * Pure CSS/SVG-free abstract glyphs — one per stage, always all visible
 * at once, no scroll-driven behavior. Used as the complete visual for
 * reduced motion, mobile/tablet, unsupported WebGL, and 3D runtime
 * failure alike (Milestone 10 §16–§18 — "Do not leave a blank canvas",
 * "the complete story must remain available without scroll-driven
 * animation"), and reused as the Suspense loading placeholder while the
 * 3D module is still downloading on desktop.
 */
export function StaticStagesVisual() {
  return (
    <div className={styles.grid} aria-hidden="true">
      {fromPlanToPlaceStages.map((stage, index) => (
        <div key={stage.index} className={`${styles.glyph} ${styles[GLYPH_CLASS[index]!]}`}>
          <span className={styles.glyphMark} />
        </div>
      ))}
    </div>
  )
}
