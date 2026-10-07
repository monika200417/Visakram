import { site } from '../data/site'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'
import { buildCanonicalUrl } from './seo'

/**
 * Fallback metadata for the /services page. The title is the one fixed in
 * docs/SEO-SPEC.md §5; the description is built only from already-verified
 * facts in src/data/site.ts — the service categories and the service area.
 * No invented claim, ranking or keyword list.
 */
export function buildServicesSeo(): DocumentMetaInput {
  return {
    title: `Residential, Villa & Apartment Construction | ${site.name}`,
    description: `${site.name} builds villas, apartments and residential construction across ${site.serviceAreas.join(' and ')}.`,
    canonicalUrl: buildCanonicalUrl('/services'),
  }
}
