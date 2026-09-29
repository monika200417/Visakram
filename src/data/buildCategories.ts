import type { Project } from './projects'

export type BuildCategory = {
  index: string
  /** Matches Project['category'] so this can key into project data later. */
  id: Project['category']
  title: string
  description: string
}

/**
 * The three primary categories from
 * docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §04. Descriptive
 * copy only — no project counts, names or claims that aren't already
 * verified in src/data/site.ts.
 */
export const buildCategories: readonly BuildCategory[] = [
  {
    index: '01',
    id: 'villa',
    title: 'Villas',
    description:
      'Independent homes built end-to-end — from foundation to finish — for families building the place they will live in.',
  },
  {
    index: '02',
    id: 'apartment',
    title: 'Apartments',
    description:
      'Multi-unit residential buildings, held to the same standard of oversight and finish as a single home.',
  },
  {
    index: '03',
    id: 'residential',
    title: 'Residential Construction',
    description:
      'Ground-up residential construction across Visakhapatnam and Vizianagaram, built to the client’s own plan and timeline.',
  },
]
