import { site } from '../data/site'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'
import { buildCanonicalUrl } from './seo'

/**
 * Fallback metadata for the /contact page, built only from already-verified
 * facts in src/data/site.ts. No invented address, phone number or
 * LocalBusiness claim — docs/SEO-SPEC.md §17-19 concluded no
 * LocalBusiness/Organization structured data ships until those fields are
 * confirmed.
 */
export function buildContactSeo(): DocumentMetaInput {
  return {
    title: `Start a Project | ${site.name}`,
    description: `Start a residential construction project with ${site.name} — villas, apartments and residential construction across ${site.serviceAreas.join(' and ')}.`,
    canonicalUrl: buildCanonicalUrl('/contact'),
  }
}
