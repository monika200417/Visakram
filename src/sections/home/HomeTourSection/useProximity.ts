import { useEffect, useState, type RefObject } from 'react'

/**
 * Two live IntersectionObservers on the same element, both kept for the
 * component's whole life (unlike FromPlanToPlace's sticky "load once" flag):
 *
 *  - `isNear`   — within a wide margin of the viewport. The 3D canvas mounts
 *                 when this becomes true and is fully disposed when it goes
 *                 false again (the section is far above/below and not needed).
 *  - `isVisible`— actually on screen. The render loop stops when it is false.
 *
 * Both are one-off, low-frequency React updates; nothing here runs per frame.
 */
export function useProximity(ref: RefObject<HTMLElement | null>, margin = '150% 0px') {
  const [isNear, setIsNear] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsNear(true)
      setIsVisible(true)
      return
    }
    const near = new IntersectionObserver(([entry]) => setIsNear(Boolean(entry?.isIntersecting)), {
      rootMargin: margin,
    })
    const visible = new IntersectionObserver(([entry]) =>
      setIsVisible(Boolean(entry?.isIntersecting)),
    )
    near.observe(element)
    visible.observe(element)
    return () => {
      near.disconnect()
      visible.disconnect()
    }
  }, [ref, margin])

  return { isNear, isVisible }
}
