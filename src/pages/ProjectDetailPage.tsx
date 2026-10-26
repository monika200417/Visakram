import { useParams } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { DevImagePlaceholder } from '../components/media/DevImagePlaceholder'
import { Button } from '../components/buttons/Button'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildProjectSeo } from '../utils/projectSeo'
import { getProjectBySlug, type Project } from '../data/projects'
import { getServiceByCategory } from '../data/services'
import { NotFoundPage } from './NotFoundPage'
import styles from './ProjectDetailPage.module.css'
import { Heading } from '../components/heading/Heading'

/**
 * /projects/:slug — reusable for every future project; there is no
 * separate hardcoded page per project. Looks the slug up in
 * src/data/projects.ts and renders the existing 404 page when it isn't
 * found (unchanged from before this milestone — this is what
 * tests/unit/routes.test.tsx's "unknown project slug" test exercises).
 */
export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) return <NotFoundPage />

  return <ProjectDetail project={project} />
}

/**
 * The fixed 6-section detail structure (Milestone 6 §5): Hero,
 * Introduction, Facts, Gallery, Video, Closing CTA. Sections 02-05 only
 * render when the project actually has that data — no invented
 * description, facts, gallery or video ever fills an empty section.
 */
function ProjectDetail({ project }: { project: Project }) {
  useDocumentMeta(buildProjectSeo(project))
  const service = getServiceByCategory(project.category)
  const categoryLabel = service?.title ?? project.category

  return (
    <article>
      {/* 01 — Hero */}
      <section className={styles.hero} aria-labelledby="project-detail-heading">
        <div className={styles.heroMedia}>
          {project.media.hero ? (
            <img
              src={project.media.hero.src}
              alt={project.media.hero.alt}
              className={styles.heroPhoto}
              decoding="async"
            />
          ) : (
            <DevImagePlaceholder label={project.name} />
          )}
        </div>
        <Container>
          <div className={styles.heroText}>
            <span className="text-mono-label">
              {categoryLabel}
              {project.year ? ` · ${project.year}` : ''}
            </span>
            <Heading as="h1" id="project-detail-heading" className={styles.title}>
              {project.name}
            </Heading>
            <p className={styles.location}>{project.location}</p>
          </div>
        </Container>
      </section>

      {/* 02 — Introduction (only when a real description was supplied) */}
      {project.description ? (
        <section aria-label="Introduction" className={styles.section}>
          <Container>
            <p className={styles.description}>{project.description}</p>
          </Container>
        </section>
      ) : null}

      {/* 03 — Facts (only from the details model, only when supplied) */}
      {project.details && project.details.length > 0 ? (
        <section aria-labelledby="project-facts-heading" className={styles.section}>
          <Container>
            <Heading as="h2" id="project-facts-heading" className={styles.sectionHeading}>
              Project facts
            </Heading>
            <dl className={styles.facts}>
              {project.details.map((detail) => (
                <div className={styles.fact} key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {/* 04 — Gallery (only from media.gallery, only when it has images) */}
      {project.media.gallery.length > 0 ? (
        <section aria-labelledby="project-gallery-heading" className={styles.section}>
          <Container>
            <Heading as="h2" id="project-gallery-heading" className={styles.sectionHeading}>
              Gallery
            </Heading>
            <ul className={styles.gallery}>
              {project.media.gallery.map((image) => (
                <li key={image.src} className={styles.galleryItem}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className={styles.galleryPhoto}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* 05 — Video (only from media.video, only when it's a real asset) */}
      {project.media.video ? (
        <section aria-labelledby="project-video-heading" className={styles.section}>
          <Container>
            <Heading as="h2" id="project-video-heading" className={styles.sectionHeading}>
              Video
            </Heading>
            <video
              className={styles.video}
              controls
              preload="none"
              poster={project.media.video.poster}
              aria-label={project.media.video.alt ?? `${project.name} video`}
            >
              <source src={project.media.video.src} />
            </video>
          </Container>
        </section>
      ) : null}

      {/* 06 — Closing CTA. No invented contact details — the same route
          every other CTA in this app already points at. */}
      <section aria-labelledby="project-cta-heading" className={styles.cta}>
        <Container>
          <Heading as="h2" id="project-cta-heading" className={styles.ctaHeading}>
            Building something similar?
          </Heading>
          <Button to="/contact" variant="primary">
            Start a project
          </Button>
        </Container>
      </section>
    </article>
  )
}
