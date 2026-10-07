/**
 * Verified business facts only (docs/CLAUDE.md §1, §4).
 * Fields that are not yet confirmed by the client are left undefined on purpose.
 */
export const site = {
  name: 'Visakram Builders',
  locality: 'Kommadi',
  city: 'Visakhapatnam',
  region: 'Andhra Pradesh',
  serviceAreas: ['Visakhapatnam', 'Vizianagaram'],
  values: ['Quality', 'Timeliness', 'Transparency'],
  /** Client-stated figures; approved wording to be confirmed before launch. */
  stats: {
    yearsExperience: '20+',
    completedProjects: '25+',
    ongoingProjects: 5,
  },

  // --- Awaiting client confirmation. Do not guess. ---
  phone: undefined as string | undefined,
  whatsappNumber: undefined as string | undefined,
  email: undefined as string | undefined,
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
