import { useRef } from 'react'
import { Container } from '../layout/Container'
import { DevImagePlaceholder } from '../media/DevImagePlaceholder'
import { ProjectCard } from '../project/ProjectCard'
import { useRevealOnScroll } from '../../animations/useRevealOnScroll'
import type { Project } from '../../data/projects'
import type { Service } from '../../data/services'
import styles from './ServiceDetail.module.css'

type ServiceDetailProps = {
  service: Service
  /** Real projects in this service's category. Empty until projects are approved. */
  relatedProjects: readonly Project[]
  align: 'start' | 'end'
}

/**
 * One service's editorial block on /services. Renders only what the data
 * actually holds: the short description always (it is verified), and the
 * long description, image, highlights and related projects only once they
 * exist — an unapproved field leaves no empty heading, list or box behind,
 * and nothing is invented to fill it. Its own component (not inlined in a
 * `.map()`) because it needs its own `useRevealOnScroll` ref
 * (docs/ANIMATION-SYSTEM.md §9 Pattern 1).
 */
export function ServiceDetail({ service, relatedProjects, align }: ServiceDetailProps) {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 24 })

  const headingId = `service-${service.slug}-heading`
  const highlights = service.highlights ?? []

  return (
    <section
      id={service.slug}
      className={styles.section}
      aria-labelledby={headingId}
      data-align={align}
    >
      <Container>
        <div ref={revealRef} className={styles.layout}>
          <div className={styles.visual}>
            {service.image ? (
              <img
                src={service.image}
                alt={service.imageAlt ?? ''}
                className={styles.photo}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <DevImagePlaceholder label={service.title} />
            )}
          </div>

          <div className={styles.text}>
            <span className={`text-mono-label ${styles.index}`}>{service.index}</span>
            <h2 id={headingId} className={styles.title}>
              {service.title}
            </h2>
            <p className={styles.lede}>{service.shortDescription}</p>
            {service.description ? (
              <p className={styles.description}>{service.description}</p>
            ) : null}

            {highlights.length > 0 ? (
              <div className={styles.highlights}>
                <p className={`text-mono-label ${styles.label}`}>What we provide</p>
                <ul className={styles.highlightList}>
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {relatedProjects.length > 0 ? (
          <div className={styles.related}>
            <p className={`text-mono-label ${styles.label}`}>Related projects</p>
            <ul className={`grid ${styles.relatedGrid}`} aria-label={`${service.title} projects`}>
              {relatedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
