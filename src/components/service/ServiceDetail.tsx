import { useEffect, useRef } from 'react'
import { Container } from '../layout/Container'
import { DevImagePlaceholder } from '../media/DevImagePlaceholder'
import { ProjectCard } from '../project/ProjectCard'
import { useRevealOnScroll } from '../../animations/useRevealOnScroll'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import type { Project } from '../../data/projects'
import type { Service } from '../../data/services'
import styles from './ServiceDetail.module.css'
import { Heading } from '../heading/Heading'

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
  const heading = service.pageTitle ?? service.title

  // A service video plays through the native `autoplay` attribute: the browser starts
  // it as soon as it is visible and holds it while it is off-screen. A script `play()`
  // at mount is rejected for an off-screen video ("paused to save power") and would
  // cancel that. Under reduced motion it stays on its first frame / poster.
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Silent playback is the only kind autoplay policies allow. React does not
    // always reflect `muted` as an attribute, so set it on the element too.
    video.muted = true
    if (reducedMotion) video.pause()
  }, [reducedMotion])

  return (
    <section
      id={service.slug}
      className={styles.section}
      aria-labelledby={headingId}
      data-align={align}
    >
      <Container>
        <div ref={revealRef} className={styles.layout}>
          <div className={styles.visual} data-media={service.video ? 'video' : undefined}>
            {service.video ? (
              <video
                ref={videoRef}
                className={styles.video}
                src={service.video.src}
                poster={service.video.poster}
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                preload={reducedMotion ? 'metadata' : 'auto'}
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
                aria-label={service.video.alt}
                aria-hidden={service.video.alt ? undefined : true}
              />
            ) : service.image ? (
              <img
                src={service.image}
                alt={service.imageAlt ?? ''}
                className={styles.photo}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <DevImagePlaceholder label={heading} />
            )}
          </div>

          <div className={styles.text}>
            <span className={`text-mono-label ${styles.index}`}>{service.index}</span>
            <Heading as="h2" id={headingId} className={styles.title}>
              {heading}
            </Heading>
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
            <ul className={`grid ${styles.relatedGrid}`} aria-label={`${heading} projects`}>
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
