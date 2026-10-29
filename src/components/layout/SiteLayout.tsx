import { useLayoutEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteCursor } from '../cursor/SiteCursor'
import { WhatsAppButton } from '../whatsapp/WhatsAppButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { applyBlushSpots, blushSpots } from './blushSpots'

/**
 * Shared page shell: skip link, header, routed content, footer, the floating WhatsApp button, and the site-wide
 * cursor. The light-orange blushes laid over the page are drawn by `main::before` (styles/layout.css); their
 * random places are chosen here, once per visit, and handed to the stylesheet as CSS variables.
 */
export function SiteLayout() {
  const mainRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (mainRef.current) applyBlushSpots(mainRef.current, blushSpots())
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <SiteCursor />
    </>
  )
}
