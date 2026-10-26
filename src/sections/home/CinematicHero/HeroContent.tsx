import { Link } from 'react-router-dom'
import { Button } from '../../../components/buttons/Button'
import { site } from '../../../data/site'
import { formatList } from '../../../utils/formatList'
import styles from './CinematicHero.module.css'

type Metric = 'ongoing' | 'completed' | 'based'

/**
 * The orbiting showcase: architecture of different kinds — a villa facade, a high-rise, a finished
 * interior — each carrying one of the company's verified figures. Imagery is a mix of Visakram's
 * own illustrative footage stills and stock photographs (see the README files under public/assets), not named
 * projects, so each is described only by what it shows.
 */
const showcase: readonly { image: string; alt: string; metric: Metric }[] = [
  {
    image: '/assets/hero/frames/f_0001.webp',
    alt: 'A contemporary villa facade at dusk',
    metric: 'ongoing',
  },
  {
    image: '/assets/testimonials/04-tower-glass.jpg',
    alt: 'A glazed high-rise tower seen from below',
    metric: 'completed',
  },
  {
    image: '/assets/hero/frames/f_0045.webp',
    alt: 'A finished living interior with a long sofa and timber floor',
    metric: 'based',
  },
  {
    image: '/assets/home-media/villas.jpg',
    alt: 'A modern villa with a glazed terrace and pool',
    metric: 'ongoing',
  },
  {
    image: '/assets/testimonials/02-balconies.jpg',
    alt: 'Balconies of a mid-rise residential block',
    metric: 'completed',
  },
  {
    image: '/assets/hero/frames/f_0062.webp',
    alt: 'An open kitchen and dining interior with warm timber joinery',
    metric: 'based',
  },
]

/**
 * The hero's real, accessible copy: the headline, the supporting line, the call to action and
 * three cards of verified company facts (src/data/site.ts only — no invented figures). It
 * fades away as the page is scrolled (see useMirageScroll).
 */
export function HeroContent() {
  return (
    <>
      <div className={styles.copy}>
        <div className={styles.veil} aria-hidden="true" />
        <h1 className={styles.headline}>
          Dream <em>today</em>, build tomorrow.
        </h1>
        <p className={styles.supporting}>
          {site.stats.yearsExperience} years turning plans, materials and construction expertise
          into spaces people can inhabit — across {formatList(site.serviceAreas)}.
        </p>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dotLong} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.heroCta}>
          <Button to="/contact" variant="primary">
            Start a Project
          </Button>
        </div>
      </div>

      <div className={styles.orbitWrap}>
        <div className={styles.orbit}>
          {showcase.map((item, index) => (
            <div
              key={item.image}
              className={styles.slot}
              style={{ ['--angle' as string]: String((360 / showcase.length) * index) + 'deg' }}
            >
              <Link to="/projects" className={styles.card}>
                <img
                  src={item.image}
                  alt={item.alt}
                  className={styles.cardImage}
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className={styles.cardShade} aria-hidden="true" />
                <span className={styles.cardBody}>
                  {item.metric === 'ongoing' ? (
                    <>
                      <span className={styles.badge}>
                        <span className={styles.badgeLive}>Ongoing</span>
                      </span>
                      <span className={styles.cardLabel}>
                        {site.stats.ongoingProjects} Ongoing Projects
                      </span>
                    </>
                  ) : item.metric === 'completed' ? (
                    <>
                      <span className={styles.statValue}>{site.stats.completedProjects}</span>
                      <span className={styles.statLabel}>Completed Projects</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.badge}>
                        <span className={styles.badgeNew}>Based in</span>
                      </span>
                      <span className={styles.cardLabel}>
                        {site.locality}, {site.city}
                      </span>
                    </>
                  )}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
