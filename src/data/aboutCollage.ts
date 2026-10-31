/**
 * The construction collage on /about, under the "15+ years" headline: every construction and building
 * photograph the site holds, set as one mosaic. Most are stock photographs from Unsplash (free to use under
 * the Unsplash License; credits in public/assets/images/projects-page/README.md and
 * public/assets/home-media/README.md); `home-media/proof-ongoing.webp` is the client-supplied "ongoing projects" photograph
 * and `house-scaffolding.webp` the client-supplied Residential Construction card picture (their licences are
 * not documented, see public/assets/home-media/README.md). Not all are Visakram Builders projects. Replace
 * them with approved project photography before launch.
 *
 * `ratio` (three columns, tablet up) and `ratioPhone` (two columns) are the width / height each picture is
 * shown at, cropped to fit. They are chosen so the columns of the mosaic come out level at the bottom: the
 * pictures are laid down column after column, so change one only together with its neighbours.
 */
export type CollageImage = {
  src: string
  alt: string
  ratio: number
  ratioPhone: number
}

export const aboutCollage: readonly CollageImage[] = [
  {
    src: '/assets/images/projects-page/construction.webp',
    alt: 'Tower cranes and scaffolding around buildings going up behind a site hoarding',
    ratio: 1.333,
    ratioPhone: 1.333,
  },
  {
    src: '/assets/images/projects-page/apartments.webp',
    alt: 'The facade of a tall apartment building, rows of balconies with glass balustrades',
    ratio: 0.769,
    ratioPhone: 0.769,
  },
  {
    src: '/assets/images/about-collage/site-crew.webp',
    alt: 'Two site workers in orange safety vests among reinforcement bars on a concrete deck',
    ratio: 1.333,
    ratioPhone: 1.333,
  },
  {
    src: '/assets/images/projects-page/villa.webp',
    alt: 'A modern white two-storey villa with a glazed balcony, a terrace and a swimming pool in daylight',
    ratio: 1.176,
    ratioPhone: 1.111,
  },
  {
    src: '/assets/home-media/proof-ongoing.webp',
    alt: 'A multi-storey residential building under construction, wrapped in scaffolding and green netting',
    ratio: 0.769,
    ratioPhone: 0.769,
  },
  {
    src: '/assets/images/projects-page/apartments-terraces.webp',
    alt: 'A mid-rise apartment building with glass balconies and roof terraces above a brick base',
    ratio: 1.333,
    ratioPhone: 1.429,
  },
  {
    src: '/assets/images/projects-page/construction-timber-frame.webp',
    alt: 'The timber frame and roof of a two-storey house under construction, with scaffolding along its eaves',
    ratio: 1.0,
    ratioPhone: 0.909,
  },
  {
    src: '/assets/images/about-collage/house-dusk.webp',
    alt: 'A two-storey house with timber cladding and glazed walls, lit at dusk beneath a large tree',
    ratio: 1.667,
    ratioPhone: 1.111,
  },
  {
    src: '/assets/images/about-collage/house-scaffolding.webp',
    alt: 'A two-storey house under construction, with bamboo scaffolding around its walls on a sunny day',
    ratio: 1.0,
    ratioPhone: 0.909,
  },
  {
    src: '/assets/images/projects-page/apartments-dusk.webp',
    alt: 'An apartment building with glazed balconies reflecting a soft pink evening sky',
    ratio: 0.667,
    ratioPhone: 0.714,
  },
  {
    src: '/assets/images/projects-page/villa-dusk.webp',
    alt: 'A contemporary villa with tall glazed walls, lit from within at dusk, behind a planted garden',
    ratio: 0.833,
    ratioPhone: 0.833,
  },
]
