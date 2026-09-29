import styles from './DevImagePlaceholder.module.css'

type DevImagePlaceholderProps = {
  label: string
}

/**
 * Generic stand-in for real photography in any image slot that isn't the
 * hero (see DevScenePlaceholder for that one). Always obvious, always
 * auditable via `data-dev-placeholder` — never a stock photo mislabelled as
 * Visakram work.
 */
export function DevImagePlaceholder({ label }: DevImagePlaceholderProps) {
  return (
    <div className={styles.placeholder} data-dev-placeholder>
      <span className={styles.tag}>Dev placeholder · {label}</span>
    </div>
  )
}
