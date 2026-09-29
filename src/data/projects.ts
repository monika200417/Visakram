import { assertUniqueIdentifiers } from './validate'

/** A single image with the alt text it needs to be accessible on its own. */
export type ProjectImage = {
  src: string
  alt: string
}

/** A single video, with an optional poster frame shown before playback. */
export type ProjectVideo = {
  src: string
  poster?: string
  alt?: string
}

/**
 * Structured media rather than bare path strings scattered through
 * components (Milestone 5 §4). `gallery` stays an empty array, not
 * undefined, so components can always `.map()` it safely.
 */
export type ProjectMedia = {
  hero?: ProjectImage
  gallery: ProjectImage[]
  video?: ProjectVideo
}

/** One free-form fact for the project-detail spec list (e.g. "Plot area"). */
export type ProjectDetail = {
  label: string
  value: string
}

/** Structure to support later, unverified SEO copy — never auto-generated. */
export type ProjectSeo = {
  metaDescription?: string
  ogImage?: string
}

/**
 * Project data model. Optional fields stay optional until verified
 * (docs/TECHNICAL-ARCHITECTURE.md §9). No project is invented:
 * the list stays empty until the client supplies real project information.
 */
export type Project = {
  slug: string
  name: string
  location: string
  category: 'villa' | 'apartment' | 'residential'
  status?: 'completed' | 'ongoing'
  year?: string
  description?: string
  /** Longer, optional facts for a future project-detail page. */
  details?: ProjectDetail[]
  media: ProjectMedia
  /** True for at most one project — see getFeaturedProject(). */
  featured?: boolean
  seo?: ProjectSeo
}

export const projects: readonly Project[] = []

// Development-time only — never lets a data mistake crash a production build.
if (import.meta.env.DEV) {
  assertUniqueIdentifiers(projects, 'slug', 'projects')
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/**
 * The project the homepage features. Explicit `featured: true` wins; with
 * none set, the first project is used as a simple, predictable fallback.
 * Returns undefined when there is nothing to feature yet.
 */
export function getFeaturedProject(): Project | undefined {
  return projects.find((project) => project.featured) ?? projects[0]
}
