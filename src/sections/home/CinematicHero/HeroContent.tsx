import { Button } from '../../../components/buttons/Button'
import { site } from '../../../data/site'
import { formatList } from '../../../utils/formatList'
import styles from './HeroContent.module.css'

const whatsappHref = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : undefined

/**
 * The hero's real, accessible content — never hidden inside the decorative
 * visual stage. `data-hero="…"` attributes are animation hooks for
 * useHeroEntrance (see that file); they carry no styling.
 */
export function HeroContent() {
  return (
    <div className={styles.content} data-hero="content">
      <p className={`text-mono-label ${styles.meta}`} data-hero="meta">
        Visakram Builders — {site.city}
      </p>

      <h1 className={styles.headline} data-hero="headline">
        Places that hold their ground.
      </h1>

      <p className={styles.supporting} data-hero="supporting">
        {site.stats.yearsExperience} years turning plans, materials and construction expertise into
        spaces people can inhabit — across {formatList(site.serviceAreas)}.
      </p>

      <div className={styles.cta} data-hero="cta">
        <Button to="/contact" variant="primary">
          Start a Project
        </Button>
        {whatsappHref ? (
          <Button href={whatsappHref} variant="secondary" target="_blank" rel="noreferrer">
            WhatsApp
          </Button>
        ) : (
          <span className={`text-small ${styles.pending}`} data-dev-placeholder>
            WhatsApp — number pending client confirmation
          </span>
        )}
      </div>
    </div>
  )
}
