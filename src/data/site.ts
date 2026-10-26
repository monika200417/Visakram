/**
 * Verified business facts only (docs/CLAUDE.md §1, §4).
 * Fields that are not yet confirmed by the client are left undefined on purpose.
 */
/**
 * The phone numbers supplied by the client (written 9515452875, 9515452876 and +91 95737 60438; the first
 * two are given the same +91 country code as the third).
 */
const phones = ['+91 95154 52875', '+91 95154 52876', '+91 95737 60438'] as const

export const site = {
  name: 'Visakram Builders',
  locality: 'Kommadi',
  city: 'Visakhapatnam',
  region: 'Andhra Pradesh',
  /** PIN code of the office address, as supplied by the client. */
  postalCode: '530048',
  serviceAreas: ['Visakhapatnam', 'Vizianagaram'],
  values: ['Quality', 'Timeliness', 'Transparency'],
  /** Client-stated figures; approved wording to be confirmed before launch. */
  stats: {
    yearsExperience: '20+',
    completedProjects: '25+',
    ongoingProjects: 5,
  },

  // --- Phone numbers and email: supplied by the client. WhatsApp uses the first number (client request). ---
  /** All the client-supplied phone numbers, in the order given. */
  phones,
  /** The first phone number (used where a single number is shown). */
  phone: phones[0] as string | undefined,
  /** The WhatsApp number: the first phone number supplied, as the client asked. */
  whatsappNumber: phones[0] as string | undefined,
  email: 'hello@visakrambuilders.com' as string | undefined,
  streetAddress: undefined as string | undefined,
  /** Production domain is unconfirmed (see docs/SEO-SPEC.md §14–15). */
  siteUrl: undefined as string | undefined,
  /** Large About-page hero image, once a real one is approved
   *  (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 10). Left
   *  undefined so the About hero renders the same dev-placeholder
   *  convention used elsewhere until a real photo is supplied — no code
   *  change needed then, just this field. */
  aboutImage: undefined as { src: string; alt: string } | undefined,
  /** Full-bleed image behind the homepage's closing statement (Chapter 14,
   *  blueprint "Large visual/video"). Left undefined so the closing renders
   *  as a type-only dark band until a real, cleared image is supplied — no
   *  code change needed then, just this field. */
  closingImage: undefined as { src: string; alt: string } | undefined,
} as const
