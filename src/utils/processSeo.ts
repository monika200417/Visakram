import { site } from '../data/site'
import { processSteps } from '../data/process'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'
import { buildCanonicalUrl } from './seo'
import { formatList } from './formatList'

/**
 * Fallback metadata for the /process page. The title is the one fixed in
 * docs/SEO-SPEC.md §5; the description is built only from the approved step
 * names in src/data/process.ts and the verified service area in
 * src/data/site.ts — no invented claim, duration or guarantee.
 */
export function buildProcessSeo(): DocumentMetaInput {
  const stages = formatList(processSteps.map((step) => step.title))
  return {
    title: `Our Construction Process | ${site.name}`,
    description: `How ${site.name} runs a residential construction project across ${site.serviceAreas.join(' and ')}: ${stages}.`,
    canonicalUrl: buildCanonicalUrl('/process'),
  }
}
