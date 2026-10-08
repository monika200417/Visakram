import { Button } from '../../../components/buttons/Button'
import { heroScenes } from '../../../data/heroScenes'
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
    <>
      <div className={styles.content} data-hero="content">
        <p className={`text-mono-label ${styles.meta}`} data-hero="meta">
          Visakram Builders — {site.city}
        </p>

        <h1 className={styles.headline} data-hero="headline">
          Places that hold their ground.
        </h1>

        <p className={styles.supporting} data-hero="supporting">
          {site.stats.yearsExperience} years turning plans, materials and construction expertise
          into spaces people can inhabit — across {formatList(site.serviceAreas)}.
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

      <HeroCaption />
    </>
  )
}

/**
 * The film's chapter caption — "01 / Arrival", then "02 / Threshold"… — a small
 * mono label with a thin gold hairline that swaps as the film plays. Every
 * caption is rendered and useHeroSceneScrub moves `data-active` / `data-pos`
 * between them, so a change never touches React. Decorative (the film is), so
 * hidden from assistive tech, and only shown while the film runs (the section's
 * `data-hero-film`); it is absolutely positioned and so never shifts layout.
 */
function HeroCaption() {
  return (
    <div className={styles.caption} aria-hidden="true">
      <ol className={styles.captionList}>
        {heroScenes.map((scene, i) => (
          <li
            key={scene.id}
            className={styles.captionItem}
            data-caption
            data-active={i === 0 ? 'true' : undefined}
            data-pos={i === 0 ? 'current' : 'next'}
          >
            <span className={`text-mono-label ${styles.captionText}`}>
              <span className={styles.captionReveal}>
                {scene.chapter} / {scene.caption}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <span className={styles.hairline} />
    </div>
  )
}
