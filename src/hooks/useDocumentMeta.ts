import { useEffect } from 'react'

export type DocumentMetaInput = {
  title: string
  description?: string
  /** Full absolute URL, already built by the caller. Omit rather than
   *  guess — see src/utils/projectSeo.ts for why this is often undefined. */
  canonicalUrl?: string
  ogImage?: string
}

type Restore = () => void

function upsertMeta(attr: 'name' | 'property', key: string, content: string): Restore {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (existing) {
    const previous = existing.getAttribute('content')
    existing.setAttribute('content', content)
    return () => {
      if (previous === null) existing.removeAttribute('content')
      else existing.setAttribute('content', previous)
    }
  }
  const created = document.createElement('meta')
  created.setAttribute(attr, key)
  created.setAttribute('content', content)
  document.head.appendChild(created)
  return () => created.remove()
}

/**
 * Minimal, dependency-free per-page <head> management (docs/SEO-SPEC.md).
 * There is no head-management library anywhere in this app — index.html's
 * static <title>/<meta description> are the defaults every route falls
 * back to. This hook temporarily overrides them for the page that calls
 * it and restores the previous values on unmount, so navigating between
 * routes in this single-page app never leaves one page's title or
 * description stuck on another.
 *
 * Renders a <link rel="canonical"> only when the caller supplies
 * `canonicalUrl` — callers only do that once a real production domain is
 * confirmed (site.siteUrl), per docs/SEO-SPEC.md §14-15. No canonical tag
 * ships with a guessed domain.
 */
export function useDocumentMeta({ title, description, canonicalUrl, ogImage }: DocumentMetaInput) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const restores: Restore[] = [
      upsertMeta('property', 'og:title', title),
      upsertMeta('property', 'og:type', 'website'),
    ]

    if (description) {
      restores.push(upsertMeta('name', 'description', description))
      restores.push(upsertMeta('property', 'og:description', description))
    }

    if (ogImage) {
      restores.push(upsertMeta('property', 'og:image', ogImage))
    }

    let canonicalEl: HTMLLinkElement | null = null
    if (canonicalUrl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      canonicalEl.setAttribute('href', canonicalUrl)
      document.head.appendChild(canonicalEl)
    }

    return () => {
      document.title = previousTitle
      restores.forEach((restore) => restore())
      canonicalEl?.remove()
    }
  }, [title, description, canonicalUrl, ogImage])
}
