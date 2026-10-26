import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../../components/layout/Container'
import { DevImagePlaceholder } from '../../../components/media/DevImagePlaceholder'
import { MediaImage } from '../../../components/media/MediaImage'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { featuredProjectPreview } from '../../../data/featuredProjectPreview'
import { getFeaturedProject } from '../../../data/projects'
import { services } from '../../../data/services'
import styles from './FeaturedProjectSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * getFeaturedProject() honours an explicit `featured: true` project, or
 * falls back to the first one — see src/data/projects.ts. `projects` is
 * empty until the client supplies one, so this is never backfilled with an
 * invented name, photo or location.
 */
const featuredProject = getFeaturedProject()

/**
 * Chapter 05 — Featured Project
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §05). Large
 * image + small metadata + strong title, not a real-estate card. Until `projects`
 * has a real entry it shows a clearly-labelled PREVIEW (data/featuredProjectPreview.ts) so
 * the layout can be reviewed; a real project replaces it automatically.
 */
export function FeaturedProjectSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section
      id="featured-project"
      className={styles.section}
      aria-labelledby="featured-project-heading"
    >
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <Heading as="h2" id="featured-project-heading" className={styles.heading}>
            Featured project.
          </Heading>

          {featuredProject ? (
            <article className={styles.spread}>
              <div className={styles.image}>
                {featuredProject.media.hero ? (
                  <img
                    src={featuredProject.media.hero.src}
                    alt={featuredProject.media.hero.alt}
                    className={styles.photo}
                  />
                ) : (
                  <DevImagePlaceholder label={featuredProject.name} />
                )}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.title}>{featuredProject.name}</h3>
                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>Location</dt>
                    <dd>{featuredProject.location}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Category</dt>
                    <dd>
                      {services.find((s) => s.category === featuredProject.category)?.title ??
                        featuredProject.category}
                    </dd>
                  </div>
                  {featuredProject.status ? (
                    <div className={styles.fact}>
                      <dt>Status</dt>
                      <dd className={styles.capitalize}>{featuredProject.status}</dd>
                    </div>
                  ) : null}
                  {featuredProject.year ? (
                    <div className={styles.fact}>
                      <dt>Year</dt>
                      <dd>{featuredProject.year}</dd>
                    </div>
                  ) : null}
                </dl>
                {featuredProject.description ? (
                  <p className={styles.description}>{featuredProject.description}</p>
                ) : null}
                <Link to={`/projects/${featuredProject.slug}`} className={styles.link}>
                  View project <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ) : (
            <article className={styles.spread}>
              <div className={styles.image}>
                <MediaImage
                  src={featuredProjectPreview.image.src}
                  alt={featuredProjectPreview.image.alt}
                />
              </div>
              <div className={styles.meta}>
                <h3 className={styles.title}>{featuredProjectPreview.name}</h3>
                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>Project</dt>
                    <dd>{featuredProjectPreview.name}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Location</dt>
                    <dd>{featuredProjectPreview.location}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Category</dt>
                    <dd>{featuredProjectPreview.category}</dd>
                  </div>
                </dl>
                <p className={styles.pending} data-dev-placeholder>
                  Preview: sample project details and a stock photograph, shown to review the
                  layout. This is not a Visakram Builders project; a client-approved project
                  replaces it.
                </p>
              </div>
            </article>
          )}
        </div>
      </Container>
    </section>
  )
}
