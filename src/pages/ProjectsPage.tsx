import { useMemo, useState } from 'react'
import { Container } from '../components/layout/Container'
import { ProjectCard } from '../components/project/ProjectCard'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildProjectsListingSeo } from '../utils/projectSeo'
import { projects, type Project } from '../data/projects'
import { services } from '../data/services'
import { site } from '../data/site'
import {
  projectsPageCategoryImages,
  projectsPageGallery,
  projectsPageHero,
} from '../data/projectsPageMedia'
import styles from './ProjectsPage.module.css'
import { Heading } from '../components/heading/Heading'

const ALL = 'all' as const
type CategoryFilter = typeof ALL | Project['category']

/**
 * Chapter 09 — Project Archive
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §09). Intro +
 * category filter + data-driven grid, entirely sourced from
 * src/data/projects.ts and src/data/services.ts — no hardcoded cards, no
 * duplicated category strings. `projects` is empty until the client
 * approves real work: until then no list is drawn, and the sample gallery stands in. No project is invented.
 *
 * Deviation from the blueprint's "editorial masonry / asymmetric grid":
 * this renders a clean, evenly responsive 1 / 2 / 3-column grid instead.
 * With no real project yet to calibrate an asymmetric layout against, and
 * per this milestone's own restraint instructions, an even grid is the
 * honest choice — it can be revisited once real project imagery exists.
 */
export function ProjectsPage() {
  useDocumentMeta(buildProjectsListingSeo())
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(ALL)

  const filteredProjects = useMemo(
    () =>
      activeFilter === ALL
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter],
  )

  // sample pictures while there is nothing real to list: the same category filter applies, "All" shows them all
  const sampleImages = useMemo(
    () =>
      activeFilter === ALL
        ? projectsPageGallery
        : projectsPageGallery.filter((image) => image.category === activeFilter),
    [activeFilter],
  )

  return (
    <>
      <section className={styles.intro}>
        <Container>
          <div className={styles.introGrid}>
            <div>
              <Heading as="h1" className={styles.heading}>
                Projects
              </Heading>
              <p className={styles.lede}>
                A working record of {site.name}&rsquo;s villas, apartments and residential
                construction &mdash; each one added here once it&rsquo;s approved to share.
              </p>
            </div>
            <figure className={styles.heroFigure}>
              <img
                src={projectsPageHero.src}
                alt={projectsPageHero.alt}
                className={styles.heroImage}
                width={1600}
                height={1067}
                loading="eager"
                decoding="async"
              />
            </figure>
          </div>
        </Container>
      </section>

      <section aria-label="Filter projects by category" className={styles.filterSection}>
        <Container>
          <div className={styles.filters} role="group" aria-label="Filter projects by category">
            <button
              type="button"
              className={styles.filterButton}
              aria-pressed={activeFilter === ALL}
              onClick={() => setActiveFilter(ALL)}
            >
              All
            </button>
            {services.map((service) => {
              const image = projectsPageCategoryImages[service.slug]
              return (
                <button
                  key={service.slug}
                  type="button"
                  className={styles.categoryTile}
                  aria-pressed={activeFilter === service.category}
                  onClick={() => setActiveFilter(service.category)}
                >
                  {image ? (
                    <img
                      src={image.src}
                      alt=""
                      className={styles.tileImage}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <span className={styles.tileLabel}>{service.title}</span>
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {filteredProjects.length > 0 ? (
        <section aria-labelledby="project-list-heading" className={styles.listSection}>
          <Container>
            <h2 id="project-list-heading" className="visually-hidden">
              All projects
            </h2>
            <ul className={`grid ${styles.grid}`}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {projects.length === 0 && sampleImages.length > 0 ? (
        <section aria-label="Gallery" className={styles.gallerySection}>
          <Container>
            <ul className={styles.gallery}>
              {sampleImages.map((image) => (
                <li key={image.id} className={styles.galleryItem}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.galleryImage}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.galleryTag}>
                    {services.find((service) => service.category === image.category)?.title}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  )
}
