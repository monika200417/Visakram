import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '../buttons/Button'
import { primaryCta, primaryNavigation } from '../../data/navigation'
import { MobileNav } from './MobileNav'
import { HERO_STATE_EVENT } from '../../sections/home/EagleHero/useScrollDive'
import styles from './Header.module.css'

/**
 * Global header: desktop nav + CTA, mobile toggle + panel. Always sticky, with black ink. It is
 * transparent over the first page (the homepage hero, marked data-hero) and a semi-opaque cream
 * bar everywhere else (data-solid): on every other route, and on the homepage once the hero has
 * given way to the page below. The brand is the logo alone, which reveals on load.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  // The bar is transparent over the first page (the homepage's hero) and semi-opaque everywhere else:
  // on every other route, and on the homepage once the hero has given way to the page below.
  const [solid, setSolid] = useState(pathname !== '/')

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      if (pathname !== '/' || typeof document.elementsFromPoint !== 'function') {
        setSolid(pathname !== '/')
        return
      }
      // what is directly beneath the bar: the hero (marked data-hero) keeps it transparent; once the
      // hero has faded out (it then stops taking pointer events) the page beneath makes it solid
      const bar = document.querySelector('header')
      const y = bar ? Math.round(bar.getBoundingClientRect().height / 2) : 40
      const under = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .find((el) => !el.closest('header') && !el.closest('[data-nav-panel]'))
      setSolid(!under?.closest('[data-hero]'))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener(HERO_STATE_EVENT, schedule)
    // the page below may change without a scroll (route change, content loading in)
    const settle = window.setTimeout(schedule, 400)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(settle)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener(HERO_STATE_EVENT, schedule)
    }
  }, [pathname])
  const mobileNavId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <header
      className={styles.header}
      data-solid={solid || undefined}
      data-menu-open={mobileOpen || undefined}
    >
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.brand} aria-label="Visakram Builders — home">
          <span className={styles.mark}>
            <img
              src="/assets/brand/visakram-builders-white.svg"
              alt="Visakram Builders"
              className={styles.markGold}
              width={1304}
              height={581}
            />
            <img
              src="/assets/brand/visakram-logo-dark.svg"
              alt=""
              className={styles.markDark}
              width={1323}
              height={594}
            />
          </span>
        </Link>

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
