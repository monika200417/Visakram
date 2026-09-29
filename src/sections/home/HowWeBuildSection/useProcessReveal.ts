import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { ease, motion } from '../../../animations/motion-tokens'

/**
 * A restrained, staggered one-shot reveal for the process steps
 * (docs/ANIMATION-SYSTEM.md §16). No pin, no scrub — native scroll is
 * untouched. The stagger itself (steps animating a beat apart) is the
 * "active stage" progression; understanding the process never depends on
 * it, since every step is real text in normal document flow either way.
 */
export function useProcessReveal(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    let cancelled = false
    let mm: GsapMatchMedia | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !section.isConnected) return

      const q = gsap.utils.selector(section)
      mm = gsap.matchMedia()

      mm.add(
        {
          reduced: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const steps = q('[data-step]')
          const { reduced } = context.conditions as { reduced: boolean }

          if (reduced || steps.length === 0) {
            gsap.set(steps, { opacity: 1, y: 0 })
            return
          }

          gsap.set(steps, { opacity: 0, y: 24 })
          gsap.to(steps, {
            opacity: 1,
            y: 0,
            duration: motion.editorial,
            ease: ease.enter,
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          })
        },
      )
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
