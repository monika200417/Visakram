import { useEffect, useState, type RefObject } from 'react'

type SectionVisibility = {
  /** Becomes true once, the first time the section approaches the
   *  viewport, and then stays true — the signal used to trigger the
   *  lazy `import()` of the 3D module (Milestone 10 §14). It never flips
   *  back, so the dynamic import is requested at most once. */
  nearViewport: boolean
  /** Tracks actual intersection for as long as the component is mounted —
   *  used to pause the R3F render loop while the chapter is genuinely
   *  offscreen (Milestone 10 §15). */
  isIntersecting: boolean
}

/**
 * Two independent IntersectionObservers on the same element: one with a
 * wide rootMargin that fires once (for the lazy-load trigger), one tight
 * to the real viewport that keeps firing for the component's lifetime
 * (for offscreen pausing). Both are one-off/low-frequency React state
 * updates — nothing here runs per animation frame.
 */
export function useSectionVisibility(
  ref: RefObject<HTMLElement | null>,
  nearViewportMargin = '600px 0px',
): SectionVisibility {
  const [nearViewport, setNearViewport] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      // No IntersectionObserver support: fail open so the chapter still
      // renders something rather than staying permanently gated.
      setNearViewport(true)
      setIsIntersecting(true)
      return
    }

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNearViewport(true)
          nearObserver.disconnect()
        }
      },
      { rootMargin: nearViewportMargin },
    )
    nearObserver.observe(element)

    const liveObserver = new IntersectionObserver(([entry]) => {
      setIsIntersecting(Boolean(entry?.isIntersecting))
    })
    liveObserver.observe(element)

    return () => {
      nearObserver.disconnect()
      liveObserver.disconnect()
    }
  }, [ref, nearViewportMargin])

  return { nearViewport, isIntersecting }
}
