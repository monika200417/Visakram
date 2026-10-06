import { useEffect, useState } from 'react'

/**
 * Whether this visit gets the pinned, scroll-scrubbed film: a desktop-width
 * viewport, motion allowed, and no data-saver request. Anything else (mobile,
 * tablet, reduced motion, Save-Data) gets the calm static block of stills and
 * never downloads a clip. Kept in sync with live viewport/media changes.
 * (No WebGL check: the film is plain video.)
 */
export function useMediaTourEligibility(): boolean {
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const saveData = () =>
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      )

    function evaluate() {
      setEligible(desktopQuery.matches && motionQuery.matches && !saveData())
    }

    evaluate()
    desktopQuery.addEventListener('change', evaluate)
    motionQuery.addEventListener('change', evaluate)
    return () => {
      desktopQuery.removeEventListener('change', evaluate)
      motionQuery.removeEventListener('change', evaluate)
    }
  }, [])

  return eligible
}
