import { useEffect, useRef, type RefObject } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '../buttons/Button'
import type { NavItem } from '../../data/navigation'
import styles from './MobileNav.module.css'

type MobileNavProps = {
  id: string
  open: boolean
  onClose: () => void
  items: readonly NavItem[]
  cta: NavItem
  toggleRef: RefObject<HTMLButtonElement | null>
}

/**
 * Full-panel mobile navigation. Minimal, non-scroll-linked motion only
 * (docs/CLAUDE.md §9 — "keep its animation minimal").
 */
export function MobileNav({ id, open, onClose, items, cta, toggleRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Close on route change.
  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Escape to close, lock body scroll, manage focus.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const toggleButton = toggleRef.current

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      ;(previouslyFocused ?? toggleButton)?.focus()
    }
  }, [open, onClose, toggleRef])

  return (
    <div
      id={id}
      ref={panelRef}
      className={styles.panel}
      data-open={open}
      data-nav-panel
      hidden={!open}
    >
      <nav aria-label="Mobile" className={styles.nav}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={styles.link} onClick={onClose}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Button to={cta.to} variant="primary" className={styles.cta} onClick={onClose}>
          {cta.label}
        </Button>
      </nav>
    </div>
  )
}
