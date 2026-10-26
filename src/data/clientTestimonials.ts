import { assertUniqueIdentifiers } from './validate'

/**
 * Cards for the homepage Testimonials carousel
 * (src/sections/home/TestimonialsSection).
 *
 * PREVIEW CONTENT. Every review below is sample text written to preview the layout, and
 * every photograph is a stock image (public/assets/testimonials/README.md): none of it was
 * said by, or is a picture of, a real client or a finished Visakram project. Five cards
 * borrow real project names and localities from Visakram's own list (`real: true`) — only
 * the name and locality are real; the person, role, quote and rating are invented. Three
 * cards are wholly invented (`real: false`). The section shows a visible preview note while
 * this is so. Replace this file's contents with approved client feedback before launch;
 * data/testimonials.ts is the older, empty collection of approved customer testimonials.
 */
export type ClientTestimonial = {
  id: string
  /** Sample client name — invented. */
  name: string
  /** Designation, or the kind of owner. */
  designation: string
  /** 1–5. */
  rating: 1 | 2 | 3 | 4 | 5
  /** The short, quotable line. */
  headline: string
  /** The detailed feedback. */
  feedback: string
  /** Project (building) name. */
  project: string
  /** Locality in Visakhapatnam. */
  location: string
  /** The kind of build, shown as a badge. */
  buildType: string
  /** Whether the project name and locality come from Visakram's own list. */
  real: boolean
  image: { src: string; alt: string }
}

export const clientTestimonials: readonly ClientTestimonial[] = [
  {
    id: 'vasudha-enclave',
    name: 'Ramesh Varma',
    designation: 'Apartment owner',
    rating: 5,
    headline: 'Handed over on the day we were promised.',
    feedback:
      'Every milestone came with a site visit and a clear update, so there were no surprises at the end. The finishing in our flat is cleaner than the show unit, and the team stayed on until the last snag was closed.',
    project: 'Vasudha Enclave',
    location: 'Old Dairy Farm',
    buildType: 'Residential apartments',
    real: true,
    image: {
      src: '/assets/testimonials/01-apartment-dusk.jpg',
      alt: 'Sample stock photograph of a modern apartment block against a dusk sky',
    },
  },
  {
    id: 'dh-enclave',
    name: 'Sowmya Nair',
    designation: 'Homeowner & software architect',
    rating: 5,
    headline: 'They explained the costs before we asked.',
    feedback:
      'Our budget was tight and I expected hidden extras. Instead we got an itemised plan, honest advice on where to save and where not to, and a site that was tidy every single week.',
    project: 'DH Enclave',
    location: 'Madhurawada',
    buildType: 'Gated apartments',
    real: true,
    image: {
      src: '/assets/testimonials/02-balconies.jpg',
      alt: 'Sample stock photograph of apartment balconies in strong afternoon light',
    },
  },
  {
    id: 'mk-royal',
    name: 'Dr. Kiran Patnaik',
    designation: 'Villa owner',
    rating: 5,
    headline: 'Craftsmanship you can see in the details.',
    feedback:
      'The joinery, the stone work and the waterproofing were all done the way we had agreed on paper. When we wanted to change the terrace late in the build, they found a way without delaying the schedule.',
    project: 'MK Royal',
    location: 'Kommadi',
    buildType: 'Independent villa',
    real: true,
    image: {
      src: '/assets/testimonials/03-villa-pool.jpg',
      alt: 'Sample stock photograph of a white modern villa with a swimming pool',
    },
  },
  {
    id: 'dmk-rk-towers',
    name: 'Anand Rao',
    designation: 'Managing partner, Rao & Sons',
    rating: 5,
    headline: 'A tower built to schedule, with paperwork in order.',
    feedback:
      'As a group of owners we needed transparency more than anything. The monthly progress reports, the material approvals and the safety discipline on site made the whole project easy to trust.',
    project: 'DMK RK Towers',
    location: 'Adarsh Nagar',
    buildType: 'Mid-rise tower',
    real: true,
    image: {
      src: '/assets/testimonials/04-tower-glass.jpg',
      alt: 'Sample stock photograph looking up at glass towers',
    },
  },
  {
    id: 'dolphin-heights',
    name: 'Lakshmi Prasad',
    designation: 'Resident, penthouse owner',
    rating: 5,
    headline: 'Our home feels solid, quiet and well lit.',
    feedback:
      'We moved in during the monsoon and there was not a single leak or crack. The ventilation and light planning is something we hear guests mention again and again.',
    project: 'Dolphin Heights',
    location: 'Arilova',
    buildType: 'Premium residences',
    real: true,
    image: {
      src: '/assets/testimonials/05-residence-terrace.jpg',
      alt: 'Sample stock photograph of a modern residence with a glazed terrace and pool',
    },
  },
  {
    id: 'sample-courtyard-house',
    name: 'Sample Client',
    designation: 'Preview card · Homeowner',
    rating: 5,
    headline: 'The site manager answered every call.',
    feedback:
      'Whenever I had a question the site manager picked up, or called back within the hour. It made building from another city feel manageable and calm.',
    project: 'Courtyard House',
    location: 'Visakhapatnam',
    buildType: 'Custom home',
    real: false,
    image: {
      src: '/assets/testimonials/06-villa-night.jpg',
      alt: 'Sample stock photograph of a modern home lit up at night',
    },
  },
  {
    id: 'sample-palm-residency',
    name: 'Sample Client',
    designation: 'Preview card · Investor',
    rating: 4,
    headline: 'A finish that has held up season after season.',
    feedback:
      'We rent these units out, so durability matters. After two heavy monsoons the paint, the plumbing and the common areas still look the way they did on handover day.',
    project: 'Palm Residency',
    location: 'Visakhapatnam',
    buildType: 'Rental apartments',
    real: false,
    image: {
      src: '/assets/testimonials/07-modern-house-dusk.jpg',
      alt: 'Sample stock photograph of a contemporary house at dusk',
    },
  },
  {
    id: 'sample-skyline-villas',
    name: 'Sample Client',
    designation: 'Preview card · Villa owner',
    rating: 5,
    headline: 'Planning that respected the plot and the budget.',
    feedback:
      'They walked the plot with us twice before drawing anything, and the final layout used the light and the breeze better than the plan we had brought them.',
    project: 'Skyline Villas',
    location: 'Visakhapatnam',
    buildType: 'Villa community',
    real: false,
    image: {
      src: '/assets/testimonials/08-pool-house.jpg',
      alt: 'Sample stock photograph of a white villa with a swimming pool and terrace',
    },
  },
]

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(clientTestimonials, 'id', 'clientTestimonials')
}

/** The two-letter monogram shown in a card's avatar. */
export function initialsOf(name: string): string {
  const parts = name
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}
