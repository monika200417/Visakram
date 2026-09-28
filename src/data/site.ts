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
} as const
