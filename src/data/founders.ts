import { assertUniqueIdentifiers } from './validate'

export type Founder = {
  slug: string
  name: string
  /** As signed under the founder's own story: "Founder" or "Co-Founder". */
  role: string
  /** The small label above the story: "Founder story" / "Co-Founder story". */
  storyLabel: string
  /** The story's headline and the line under it, as supplied by the founder. */
  headline: string
  subheading: string
  /** The story itself, one entry per paragraph, exactly as supplied by the founder. */
  story: string[]
  /** The line the founder closes the story with, above the signature. */
  closing: string
  education?: string[]
  image?: string
}

/**
 * The two founders' own stories, as written and supplied by them, with their education kept
 * (docs/CLAUDE.md §1: no founder fact is written here that the founder did not supply). No photo exists yet
 * (`image` stays undefined — never a stand-in photo).
 */
export const founders: readonly Founder[] = [
  {
    slug: 'shanmukesh-sirikolla',
    name: 'Shanmukesh Sirikolla',
    role: 'Founder',
    storyLabel: 'Founder story',
    headline: 'Driven by Ambition. Grounded in Experience.',
    subheading: 'The Story Behind the Vision',
    story: [
      'My journey in business began with a strong interest in understanding how things are built, how businesses grow, and how meaningful relationships are created along the way. With a Bachelor’s degree in Business Administration from Dr. Lankapalli Bullayya College and an MBA in Marketing from IGNOU, I developed a foundation in business management, strategic thinking, and customer relationships. Over the past six years, my experience in the construction industry, alongside successfully managing an electrical distribution business in Visakhapatnam, has given me valuable insight into the importance of quality, reliability, and delivering on commitments.',
      'Being part of Visakram Builders represents an opportunity to bring together my industry experience, entrepreneurial mindset, and passion for creating something meaningful. I believe that successful developments begin with understanding people’s needs and making thoughtful decisions at every stage. My focus is on strengthening customer relationships, maintaining transparency, and ensuring that every project reflects the quality and commitment our customers deserve.',
      'As we build the future of Visakram Builders, my ambition is to contribute to a company that people can confidently associate with trust, progress, and lasting value. I believe that real success is not measured only by how much we build, but by the confidence we earn and the relationships we preserve along the way. With this belief, I look forward to contributing to Andhra Pradesh’s growing landscape, one meaningful development at a time.',
    ],
    closing: 'Turning Land Into Legacy.',
    education: ['MBA in Marketing — IGNOU', 'BBA — Dr. L. Bullayya College'],
  },
  {
    slug: 'venkata-satish-anne',
    name: 'Venkata Satish Anne',
    role: 'Co-Founder',
    storyLabel: 'Co-Founder story',
    headline: 'Built on Experience. Driven by Purpose.',
    subheading: 'The Story Behind Visakram Builders',
    story: [
      'Over the years, working in the construction and interiors industry, I have learned that a building is much more than concrete, steel, and design. Behind every project are people’s dreams, hard-earned investments, and the trust they place in those who build for them. My experience has taught me that successful developments are built not only through technical expertise, but through thoughtful planning, attention to detail, honest communication, and a genuine sense of responsibility.',
      'This belief inspired me to establish Visakram Builders — a company where quality, integrity, and commitment form the foundation of everything we do. My vision is to create thoughtfully designed residential and commercial spaces that improve everyday living, support growing businesses, and contribute to the evolving landscape of Andhra Pradesh. Every development we undertake should reflect our respect for the people who place their confidence in us.',
      'As we move forward, my ambition is not simply to build more, but to build better. I want Visakram Builders to be recognised for the trust we earn, the commitments we honour, and the lasting value we create. Because I firmly believe that a company’s true reputation is not built through what it promises, but through what it consistently delivers.',
    ],
    closing: 'Turning Land Into Legacy.',
    education: [
      'M.S. (M.I.T.) — University of Salford',
      'B.Tech in Electrical, Electronics and Communications — Andhra University',
    ],
  },
]

if (import.meta.env.DEV) {
  assertUniqueIdentifiers(founders, 'slug', 'founders')
}

export function getFounderBySlug(slug: string): Founder | undefined {
  return founders.find((founder) => founder.slug === slug)
}
