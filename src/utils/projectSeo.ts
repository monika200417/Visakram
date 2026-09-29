import { site } from '../data/site'
import { getServiceByCategory } from '../data/services'
import type { Project } from '../data/projects'
import type { DocumentMetaInput } from '../hooks/useDocumentMeta'
import { buildCanonicalUrl } from './seo'

/** Fallback metadata for the /projects archive page, built only from
 *  already-verified site facts (src/data/site.ts) — no invented counts. */
export function buildProjectsListingSeo(): DocumentMetaInput {
  return {
    title: `Projects — ${site.name}`,
    description: `Villas, apartments and residential construction projects by ${site.name} in ${site.serviceAreas.join(' and ')}.`,
    canonicalUrl: buildCanonicalUrl('/projects'),
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
    canonicalUrl: buildCanonicalUrl(`/projects/${project.slug}`),
    ogImage: project.seo?.ogImage ?? project.media.hero?.src,
  }
}
