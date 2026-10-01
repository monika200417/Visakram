import { useEffect, useState } from 'react'
import { detectWebglSupport } from '../../../three/utils/detectWebglSupport'

/**
 * Whether this visit is even a candidate for the WebGL chapter at all —
 * checked once on mount and kept in sync with live viewport/media
 * changes (Milestone 10 §16 mobile strategy, §17 reduced motion, §18
 * WebGL failure). A `false` result here means FromPlanToPlaceSection
 * renders the static HTML/CSS fallback and never attempts to import
 * Three.js/R3F at all — on a narrow viewport or with reduced motion
 * requested, the 3D chunk is never downloaded.
 */
export function useCanvasEligibility(): boolean {
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    // Default state is already `false` — nothing to set for this branch.
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')

    function evaluate() {
      setEligible(desktopQuery.matches && motionQuery.matches && detectWebglSupport())
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
