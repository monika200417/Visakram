import { Logo } from '../brand/Logo'
import { primaryNavigation } from '../../data/navigation'
import { site } from '../../data/site'
import styles from './Footer.module.css'

/**
 * Footer only renders contact fields that are actually verified in
 * src/data/site.ts (docs/CLAUDE.md §4/§10 — no invented contact details).
 */
export function Footer() {
  const contactLines = [
    site.phone && { label: 'Phone', value: site.phone, href: `tel:${site.phone}` },
    site.email && { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ].filter((line): line is { label: string; value: string; href: string } => Boolean(line))

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo variant="light" />
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
                <li key={line.label}>
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
      </div>
    </footer>
  )
}
