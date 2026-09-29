import { assertUniqueIdentifiers } from './validate'

export type Founder = {
  slug: string
  name: string
  /**
   * Verified skill/experience focus supplied for the site
   * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §03). Not a
   * confirmed formal title at Visakram Builders — no such title has been
   * verified, so none is invented here.
   */
  positioning: string
  age?: number
  /**
   * Verified, independently-listed background facts. This is personal
   * professional history, supplied by the founder — it is not a list of
   * Visakram Builders projects. See `founderBackgroundDisclaimer` below;
   * any component that renders this array must carry that disclaimer.
   */
  background: string[]
  education?: string[]
  /** Verified geographic exposure from prior work, not Visakram's own service area. */
  exposure?: string
  image?: string
  quote?: string
}

/**
 * Required wherever `background` is rendered
 * (docs/CLAUDE.md §"Never convert a founder's previous employment/project
 * history into a claim that those projects were executed by Visakram
 * Builders unless explicitly verified." / docs/TECHNICAL-ARCHITECTURE.md
 * §10 rule 8). Centralized here so it can't be left off a future About-page
 * component by accident.
 */
export const founderBackgroundDisclaimer =
  'Professional background shown here predates Visakram Builders and reflects each founder’s individual experience — it does not mean these projects were executed by Visakram Builders.'

/**
 * Verified founder information only
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §03 "Founder
 * narrative"). No photo exists yet (`image` stays undefined — never a
 * stand-in photo), and no formal title at Visakram Builders has been
 * confirmed, so `positioning` uses the supplied skill-focus wording instead
 * of an invented role like "Co-Founder" or "CEO".
 */
export const founders: readonly Founder[] = [
  {
    slug: 'shanmukesh-sirikolla',
    name: 'Shanmukesh Sirikolla',
    positioning: 'Business, Marketing, Electrical Distribution & Construction',
    age: 28,
    background: [
      '6 years in Electrical Distribution',
      'Construction experience with Sai Manikanta Developers',
    ],
    education: ['MBA in Marketing — IGNOU', 'BBA — Dr. L. Bullayya College'],
  },
  {
    slug: 'venkata-satish-anne',
    name: 'Venkata Satish Anne',
    positioning: 'Project Planning, Estimation, Procurement, Operations & Project Management',
    background: [
      '15+ years of experience in project planning, implementation, administration and facility operations in joinery/interior fit-out, including projects of USD 50 million and above',
      'Professional history includes Salix International Interiors and Contracting, Fire Mount Textiles Group, KEF Infra India, Prestige Group, Global Wood Work LLC and Jasco International FZC',
    ],
    education: [
      'M.S. (M.I.T.) — University of Salford',
      'B.Tech in Electrical, Electronics and Communications — Andhra University',
    ],
    exposure: 'Projects and clients across India, Mauritius, Oman, UAE, Saudi Arabia and the UK',
  },
]

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(founders, 'slug', 'founders')
}

export function getFounderBySlug(slug: string): Founder | undefined {
  return founders.find((founder) => founder.slug === slug)
}
