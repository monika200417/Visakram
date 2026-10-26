import { useEffect, type RefObject } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Sets `data-<attr>="true"` on the element each time it comes into view (once most of it is on screen)
 * and clears it only when it is completely out of sight, so nothing is seen to snap back and the
 * element's entrance replays on the next visit. Written straight to the element, no React state.
 * Under reduced motion it does nothing: the element's CSS shows it in place.
 */
export function useReplayOnView(ref: RefObject<HTMLElement | null>, attr: string) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return
    // without IntersectionObserver there is no way to know: just play
    if (typeof IntersectionObserver === 'undefined') {
      element.dataset[attr] = 'true'
      return
    }
    let armed = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.intersectionRatio === 0) {
          delete element.dataset[attr]
          armed = true
        } else if (armed && entry.intersectionRatio >= 0.6) {
          armed = false
          element.dataset[attr] = 'true'
        }
      },
      { threshold: [0, 0.6] },
    )
    io.observe(element)
    return () => {
      io.disconnect()
      delete element.dataset[attr]
    }
  }, [ref, attr, reducedMotion])
}
