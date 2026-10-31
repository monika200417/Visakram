/**
 * Photography for the /projects page: a wide picture beside the introduction, one picture for each category
 * button, and a sample gallery under the filter. They are stock photographs from Unsplash (free to use under
 * the Unsplash License, see public/assets/images/projects-page/README.md); they are not photographs of
 * Visakram Builders projects. Replace them with approved project photography before launch.
 */
export type ProjectsPageImage = {
  src: string
  alt: string
}

export const projectsPageHero: ProjectsPageImage = {
  src: '/assets/images/projects-page/villa.webp',
  alt: 'A modern white two-storey villa with a glazed balcony, a shaded terrace and a swimming pool in bright daylight',
}

/** Keyed by a service's `slug` (data/services.ts), so the buttons stay built from that list. */
export const projectsPageCategoryImages: Readonly<Record<string, ProjectsPageImage>> = {
  villas: projectsPageHero,
  apartments: {
    src: '/assets/images/projects-page/apartments.webp',
    alt: 'The facade of a tall apartment building, rows of balconies with glass balustrades',
  },
  'residential-construction': {
    src: '/assets/images/projects-page/construction.webp',
    alt: 'Tower cranes and scaffolding around a building going up behind a site hoarding',
  },
}

/**
 * Sample gallery under the filter: every picture sits under one category, the "All" filter shows them all.
 * Shown only while there are no approved projects (see ProjectsPage); `category` is a Project['category'] so
 * the buttons, built from data/services.ts, can filter it.
 */
export type ProjectsPageGalleryImage = ProjectsPageImage & {
  id: string
  category: 'villa' | 'apartment' | 'residential'
}

export const projectsPageGallery: readonly ProjectsPageGalleryImage[] = [
  {
    id: 'villa-pool',
    category: 'villa',
    src: '/assets/images/projects-page/villa.webp',
    alt: 'A modern white two-storey villa with a glazed balcony, a terrace and a swimming pool in daylight',
  },
  {
    id: 'villa-dusk',
    category: 'villa',
    src: '/assets/images/projects-page/villa-dusk.webp',
    alt: 'A contemporary villa with tall glazed walls, lit from within at dusk, behind a planted garden',
  },
  {
    id: 'apartments-balconies',
    category: 'apartment',
    src: '/assets/images/projects-page/apartments.webp',
    alt: 'The facade of a tall apartment building, rows of balconies with glass balustrades',
  },
  {
    id: 'apartments-dusk',
    category: 'apartment',
    src: '/assets/images/projects-page/apartments-dusk.webp',
    alt: 'An apartment building with glazed balconies reflecting a soft pink evening sky',
  },
  {
    id: 'apartments-terraces',
    category: 'apartment',
    src: '/assets/images/projects-page/apartments-terraces.webp',
    alt: 'A mid-rise apartment building with glass balconies and roof terraces above a brick base',
  },
  {
    id: 'construction-cranes',
    category: 'residential',
    src: '/assets/images/projects-page/construction.webp',
    alt: 'Tower cranes and scaffolding around buildings going up behind a site hoarding',
  },
  {
    id: 'construction-timber-frame',
    category: 'residential',
    src: '/assets/images/projects-page/construction-timber-frame.webp',
    alt: 'The timber frame and roof of a two-storey house under construction, with scaffolding along its eaves',
  },
]
