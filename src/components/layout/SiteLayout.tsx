import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/** Shared page shell: skip link, header, routed content, footer. */
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
    </>
  )
}
