import styles from './CinematicHero.module.css'

/**
 * The scroll cue: "Explore" over a small chevron that bobs. A plain anchor to #statement —
 * no JS scroll handling; smooth scrolling is CSS-only and disabled under
 * prefers-reduced-motion (src/styles/global.css).
 */
export function ScrollIndicator() {
  return (
    <a href="#statement" className={styles.cue} data-layer="cue">
      <span className={styles.cueLabel}>Explore</span>
      <span className={styles.cueCircle} aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 4l4 4 4-4"
            stroke="rgba(232,220,200,0.75)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  )
}
