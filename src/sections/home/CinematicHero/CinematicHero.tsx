import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/buttons/Button'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { site } from '../../../data/site'
import { formatList } from '../../../utils/formatList'
import { HeroContent } from './HeroContent'
import { ScrollIndicator } from './ScrollIndicator'
import { useMirageScroll } from './useMirageScroll'
import styles from './CinematicHero.module.css'

const whatsappHref = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : undefined

/**
 * Cinematic architectural arrival. A tall outer element (620svh: 420 of film, then a 100svh hold) holds one sticky,
 * viewport-sized stage whose layers — a warm backdrop, a glow, a gateway, drifting
 * clouds — are driven by the page scroll in a single requestAnimationFrame loop
 * (useMirageScroll): the gateway zooms until it fills the screen, the hero copy
 * fades away, and the closing call to action arrives with the Visakram mark at the centre.
 * Under reduced motion nothing is tall or animated: the stage is one still screen.
 */
export function CinematicHero() {
  const reducedMotion = usePrefersReducedMotion()

  const outer = useRef<HTMLElement>(null)
  useMirageScroll(outer, !reducedMotion)

  return (
    <section
      data-nav-tone="dark"
      ref={outer}
      className={styles.outer}
      data-still={reducedMotion ? 'true' : undefined}
      aria-label="Visakram Builders"
    >
      <div className={styles.stage}>
        <div data-layer="bg" className={styles.bg} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />
        <div data-layer="glow" className={styles.glow} aria-hidden="true" />
        <div data-layer="portal" className={styles.portal} aria-hidden="true" />
        <div data-layer="clouds" className={styles.clouds} aria-hidden="true" />

        <div data-layer="hero" className={styles.hero}>
          <HeroContent />
        </div>

        <div data-layer="cta" className={styles.cta}>
          <div data-layer="overlay" className={styles.ctaOverlay} aria-hidden="true" />
          <div className={styles.ctaInner}>
            <div data-layer="logo" className={styles.logo}>
              <img
                src="/assets/brand/visakram-builders-white.svg"
                alt="Visakram Builders"
                width={1304}
                height={581}
              />
            </div>
            <h2 className={styles.ctaHeading}>Build what lasts</h2>
            <p className={styles.ctaText}>
              Guided by {formatList(site.values).toLowerCase()} at every stage — building across{' '}
              {formatList(site.serviceAreas)}.
            </p>
            <Link to="/contact" className={styles.ctaLink}>
              Start Your Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 6.5h9M8 3l3.5 3.5L8 10"
                  stroke="rgba(232,220,200,0.8)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            {whatsappHref ? (
              <Button href={whatsappHref} variant="secondary" target="_blank" rel="noreferrer">
                WhatsApp
              </Button>
            ) : (
              <span className={styles.pending} data-dev-placeholder>
                WhatsApp — number pending client confirmation
              </span>
            )}
          </div>
        </div>

        <ScrollIndicator />
      </div>
    </section>
  )
}
