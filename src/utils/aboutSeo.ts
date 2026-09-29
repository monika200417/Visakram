import { site } from '../data/site'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'
import { buildCanonicalUrl } from './seo'

/**
 * Fallback metadata for the /about page, built only from already-verified
 * facts in src/data/site.ts — years of experience, service categories and
 * service area. No invented slogan, ranking or claim.
 */
export function buildAboutSeo(): DocumentMetaInput {
  return {
    title: `About ${site.name} | ${site.city}`,
    description: `${site.name} brings ${site.stats.yearsExperience} years of construction experience to residential building — villas, apartments and residential construction — across ${site.serviceAreas.join(' and ')}.`,
    canonicalUrl: buildCanonicalUrl('/about'),
  }
}
