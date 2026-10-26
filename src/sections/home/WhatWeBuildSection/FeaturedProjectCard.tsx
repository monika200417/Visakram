import { Link } from 'react-router-dom'
import { DevImagePlaceholder } from '../../../components/media/DevImagePlaceholder'
import { MediaImage } from '../../../components/media/MediaImage'
import { featuredProjectPreview } from '../../../data/featuredProjectPreview'
import { getFeaturedProject } from '../../../data/projects'
import styles from './WhatWeBuildSection.module.css'

/**
 * getFeaturedProject() honours an explicit `featured: true` project, or falls back to the first
 * one — see src/data/projects.ts. `projects` is empty until the client supplies one, so this is
 * never backfilled with an invented name, photo or location.
 */
const featuredProject = getFeaturedProject()

/**
 * The last card of the What We Build carousel: the featured project (the one src/data/projects.ts
 * names, or its first project). A real project shows its own hero photograph, name and location and links to its
 * page. Until there is one, the card shows the preview photograph and sample name from
 * src/data/featuredProjectPreview.ts (a stock photograph and sample text, not a Visakram project), is
 * marked data-preview for audit, and links to the projects page; a client-approved project replaces
 * it automatically. The page shows no visible label on the card.
 */
export function FeaturedProjectCard() {
  const href = featuredProject ? `/projects/${featuredProject.slug}` : '/projects'
  const name = featuredProject ? featuredProject.name : featuredProjectPreview.name
  const location = featuredProject ? featuredProject.location : featuredProjectPreview.location

  return (
    // data-preview marks sample content for audit without showing anything on the card
    <li className={styles.card} data-preview={featuredProject ? undefined : 'true'}>
      <Link
        to={href}
        className={styles.link}
        aria-label={`Featured project — ${name}, ${location}`}
      >
        <div className={styles.image}>
          <div className={styles.imageInner} data-media="image">
            {featuredProject ? (
              featuredProject.media.hero ? (
                <img
                  src={featuredProject.media.hero.src}
                  alt={featuredProject.media.hero.alt}
                  className={styles.photo}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <DevImagePlaceholder label={featuredProject.name} />
              )
            ) : (
              <MediaImage
                src={featuredProjectPreview.image.src}
                alt={featuredProjectPreview.image.alt}
              />
            )}
          </div>
          <span className={`text-mono-label ${styles.index}`}>Featured</span>
        </div>
        <div className={styles.text}>
          <h3 className={styles.title}>Featured projects</h3>
          <p className={styles.description}>
            {name} — {location}
          </p>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </li>
  )
}
