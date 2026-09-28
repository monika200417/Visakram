import { Outlet } from 'react-router-dom'

/**
 * Shared page shell. Header, footer and navigation arrive in Milestones 2–3;
 * for now it provides the landmark structure and a skip link.
 */
export function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main">
        <Outlet />
      </main>
    </>
  )
}
