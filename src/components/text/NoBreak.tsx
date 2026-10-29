import type { ReactNode } from 'react'
import styles from './NoBreak.module.css'

/**
 * Keeps a name that must not be split across two lines together — "Andhra Pradesh", never "Andhra" at the
 * end of one line and "Pradesh" at the start of the next. The text itself is unchanged (no special space
 * character), so searching, copying and screen readers all see the ordinary words.
 */
export function NoBreak({ children }: { children: ReactNode }) {
  return <span className={styles.noBreak}>{children}</span>
}
