import { Link } from 'react-router-dom'
import { DevImagePlaceholder } from '../media/DevImagePlaceholder'
import type { Project } from '../../data/projects'
import { getServiceByCategory } from '../../data/services'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
}

/**
 * Reusable project preview for the archive grid (Milestone 6). Renders
 * only fields the project actually has — title, location, category, year
 * and a hero image when one exists. When it doesn't, falls back to the
 * same DevImagePlaceholder convention used elsewhere in the app
 * (FeaturedProjectSection, BuildCategoryCard) rather than a generic icon or
 * a silently blank box, so a missing photo is always obvious and
 * auditable, never mistaken for one that was simply omitted.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const service = getServiceByCategory(project.category)
  const categoryLabel = service?.title ?? project.category

  return (
    <li className={styles.card}>
      <Link
        to={`/projects/${project.slug}`}
        className={styles.link}
        aria-label={`${project.name} — view project`}
      >
        <div className={styles.image}>
          {project.media.hero ? (
            <img
              src={project.media.hero.src}
              alt={project.media.hero.alt}
              className={styles.photo}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <DevImagePlaceholder label={project.name} />
          )}
        </div>
        <div className={styles.text}>
          <span className={`text-mono-label ${styles.meta}`}>
            {categoryLabel}
            {project.year ? ` · ${project.year}` : ''}
          </span>
          <h3 className={styles.title}>{project.name}</h3>
          <p className={styles.location}>{project.location}</p>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </li>
  )
}
