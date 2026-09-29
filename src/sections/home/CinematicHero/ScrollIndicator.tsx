import styles from './ScrollIndicator.module.css'

/**
 * "Explore" affordance. A plain anchor to #statement — no JS scroll
 * handling needed; smooth scrolling is CSS-only and already disabled under
 * prefers-reduced-motion (src/styles/global.css).
 */
export function ScrollIndicator() {
  return (
    <a href="#statement" className={styles.indicator} data-hero="indicator">
      <span className={styles.label}>Explore</span>
      <span className={styles.line} aria-hidden="true" />
    </a>
  )
}
