import { Outlet } from 'react-router-dom'
import { SiteCursor } from '../cursor/SiteCursor'
import { WhatsAppButton } from '../whatsapp/WhatsAppButton'
import { Footer } from './Footer'
import { Header } from './Header'

/** Shared page shell: skip link, header, routed content, footer, the floating WhatsApp button, and the site-wide cursor. */
export function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <SiteCursor />
    </>
  )
}
