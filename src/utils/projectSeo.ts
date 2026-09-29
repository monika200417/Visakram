import { site } from '../data/site'
import { getServiceByCategory } from '../data/services'
import type { Project } from '../data/projects'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'

/** Builds an absolute canonical URL only once a production domain is
 *  confirmed. site.siteUrl is undefined until the client confirms it
 *  (docs/SEO-SPEC.md §14-15) — no placeholder domain is ever substituted. */
function canonicalFor(path: string): string | undefined {
  if (!site.siteUrl) return undefined
  return `${site.siteUrl.replace(/\/$/, '')}${path}`
}

/** Fallback metadata for the /projects archive page, built only from
 *  already-verified site facts (src/data/site.ts) — no invented counts. */
export function buildProjectsListingSeo(): DocumentMetaInput {
  return {
    title: `Projects — ${site.name}`,
    description: `Villas, apartments and residential construction projects by ${site.name} in ${site.serviceAreas.join(' and ')}.`,
    canonicalUrl: canonicalFor('/projects'),
  }
}

/**
 * Fallback metadata for a /projects/:slug page. Prefers the project's own
 * client-approved seo fields when supplied; otherwise builds a short,
 * honest description from verified Project fields alone — never an
 * invented statistic, date or claim. og:image only ever comes from the
 * project's own real photography (project.seo.ogImage or its hero image),
 * never an unrelated stock image (docs/SEO-SPEC.md §21).
 */
export function buildProjectSeo(project: Project): DocumentMetaInput {
  const serviceTitle = getServiceByCategory(project.category)?.title
  const description =
    project.seo?.metaDescription ??
    `${project.name}${serviceTitle ? `, a ${serviceTitle.toLowerCase()} project` : ''} by ${site.name} in ${project.location}.`

  return {
    title: `${project.name} — ${site.name}`,
    description,
    canonicalUrl: canonicalFor(`/projects/${project.slug}`),
    ogImage: project.seo?.ogImage ?? project.media.hero?.src,
  }
}
