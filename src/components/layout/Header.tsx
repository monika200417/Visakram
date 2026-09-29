import { useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../buttons/Button'
import { primaryCta, primaryNavigation } from '../../data/navigation'
import { MobileNav } from './MobileNav'
import styles from './Header.module.css'

/**
 * Stable global header. No scroll-based behaviour yet — that arrives with
 * the cinematic milestones. Desktop nav + CTA, mobile toggle + panel.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileNavId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Logo />

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul className={styles.list}>
            {primaryNavigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={styles.link}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button to={primaryCta.to} variant="primary" className={styles.desktopCta}>
            {primaryCta.label}
          </Button>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className={styles.toggleIcon} data-open={mobileOpen} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileNav
        id={mobileNavId}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={primaryNavigation}
        cta={primaryCta}
        toggleRef={toggleRef}
      />
    </header>
  )
}
