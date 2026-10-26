import { Logo } from '../brand/Logo'
import { primaryNavigation } from '../../data/navigation'
import { samify } from '../../data/samify'
import { site } from '../../data/site'
import { telHref } from '../../utils/telHref'
import styles from './Footer.module.css'

/**
 * Footer only renders contact fields that are actually verified in
 * src/data/site.ts (docs/CLAUDE.md §4/§10 — no invented contact details).
 */
export function Footer() {
  const contactLines = [
    ...site.phones.map((phone) => ({ value: phone, href: telHref(phone) })),
    ...(site.email ? [{ value: site.email, href: `mailto:${site.email}` }] : []),
  ]

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{site.values.join(' · ')}</p>
        </div>

        <nav aria-label="Footer" className={styles.nav}>
          <span className={styles.heading}>Site</span>
          <ul className={styles.list}>
            {primaryNavigation.map((item) => (
              <li key={item.to}>
                <a href={item.to}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.location}>
          <span className={styles.heading}>Based in</span>
          <p className="text-mono-label">
            {site.locality}, {site.city}
          </p>
          <p className="text-mono-label">{site.region}</p>
          <span className={styles.heading}>Building across</span>
          <p className="text-mono-label">{site.serviceAreas.join(' + ')}</p>
        </div>

        {contactLines.length > 0 && (
          <div className={styles.contact}>
            <span className={styles.heading}>Contact</span>
            <ul className={styles.list}>
              {contactLines.map((line) => (
                <li key={line.href}>
                  <a href={line.href}>{line.value}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className="text-mono-label">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className={styles.credit}>
          <span className={styles.powered}>Powered by</span>{' '}
          <a
            href={samify.url}
            className={styles.creditLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Powered by ${samify.name} (${samify.domain}) — opens in a new tab`}
          >
            {samify.name}
            <span className={styles.creditDomain}>{samify.domain}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <span className={styles.creditLine}>{samify.tagline}</span>
        </p>
      </div>
    </footer>
  )
}
