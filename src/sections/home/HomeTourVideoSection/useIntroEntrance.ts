import { useEffect, type RefObject } from 'react'

/**
 * Plays the Home Tour introduction's entrance once, the first time it is comfortably on screen:
 * it sets `data-in` on the element and the CSS does the rest (a small rise, a fade and a blur
 * that sharpens, staggered). The text is real, visible-by-default content: where there is no
 * IntersectionObserver the attribute is set at once, so nothing is ever left hidden. One
 * attribute write, no React state.
 */
export function useIntroEntrance(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      element.dataset.in = 'true'
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.in = 'true'
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}
