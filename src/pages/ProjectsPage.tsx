import { useMemo, useState } from 'react'
import { Container } from '../components/layout/Container'
import { ProjectCard } from '../components/project/ProjectCard'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildProjectsListingSeo } from '../utils/projectSeo'
import { projects, type Project } from '../data/projects'
import { services } from '../data/services'
import { site } from '../data/site'
import styles from './ProjectsPage.module.css'

const ALL = 'all' as const
type CategoryFilter = typeof ALL | Project['category']

/**
 * Chapter 09 — Project Archive
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §09). Intro +
 * category filter + data-driven grid, entirely sourced from
 * src/data/projects.ts and src/data/services.ts — no hardcoded cards, no
 * duplicated category strings. `projects` is empty until the client
 * approves real work, so the grid renders a refined, non-dominant empty
 * state instead of any invented project.
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

  const activeServiceTitle = services.find((service) => service.category === activeFilter)?.title

  return (
    <>
      <section className={styles.intro}>
        <Container>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.lede}>
            A working record of {site.name}&rsquo;s villas, apartments and residential construction
            &mdash; each one added here once it&rsquo;s approved to share.
          </p>
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
            {services.map((service) => (
              <button
                key={service.slug}
                type="button"
                className={styles.filterButton}
                aria-pressed={activeFilter === service.category}
                onClick={() => setActiveFilter(service.category)}
              >
                {service.title}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="project-list-heading" className={styles.listSection}>
        <Container>
          <h2 id="project-list-heading" className="visually-hidden">
            All projects
          </h2>
          {filteredProjects.length > 0 ? (
            <ul className={`grid ${styles.grid}`}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          ) : (
            <p className={styles.empty} data-dev-placeholder>
              {activeFilter === ALL
                ? `No projects to show yet. This page is built to hold every ${site.name} project — villas, apartments and residential construction — as soon as one is approved to share.`
                : `No ${activeServiceTitle?.toLowerCase() ?? 'matching'} projects to show yet.`}
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
