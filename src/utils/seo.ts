import { site } from '../data/site'

/**
 * Builds an absolute canonical URL only once a production domain is
 * confirmed. `site.siteUrl` is undefined until the client confirms it
 * (docs/SEO-SPEC.md §14-15) — no placeholder domain is ever substituted.
 * Shared by every page-level SEO builder (src/utils/projectSeo.ts,
 * src/utils/aboutSeo.ts) so the domain-guessing rule lives in one place.
 */
export function buildCanonicalUrl(path: string): string | undefined {
  if (!site.siteUrl) return undefined
  return `${site.siteUrl.replace(/\/$/, '')}${path}`
}
