import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../../components/layout/Container'
import { DevImagePlaceholder } from '../../../components/media/DevImagePlaceholder'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { getFeaturedProject } from '../../../data/projects'
import { services } from '../../../data/services'
import styles from './FeaturedProjectSection.module.css'

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
 * image + small metadata + strong title, not a real-estate card. Renders a
 * clearly-labelled "awaiting content" state — never a fabricated project —
 * until `projects` has a real entry.
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
          <p className={`text-mono-label ${styles.eyebrow}`}>05 — Featured Project</p>
          <h2 id="featured-project-heading" className={styles.heading}>
            Featured project.
          </h2>

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
            <div className={styles.spread}>
              <div className={styles.image}>
                <DevImagePlaceholder label="Featured project" />
              </div>
              <div className={styles.meta}>
                <p className={styles.pending} data-dev-placeholder>
                  Awaiting a client-approved project. This space is built to carry a project name,
                  location, category and photography as soon as one is confirmed — no project is
                  shown here until then.
                </p>
                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>Project</dt>
                    <dd>—</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Location</dt>
                    <dd>—</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Category</dt>
                    <dd>—</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
