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
  images: string[]
  videos?: string[]
}

export const projects: readonly Project[] = []

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
