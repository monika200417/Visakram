import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from './gsap'
import { ease, motion } from './motion-tokens'

type RevealOptions = {
  y?: number
  duration?: number
}

/**
 * Level 2 "editorial reveal" (docs/ANIMATION-SYSTEM.md §7, Scroll
 * Architecture Pattern 1): fade + translateY once, the first time the
 * element enters the viewport. `prefers-reduced-motion: reduce` shows the
 * final state immediately — no ScrollTrigger is created.
 */
export function useRevealOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { y = 24, duration = motion.editorial }: RevealOptions = {},
) {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    let cancelled = false
    let mm: GsapMatchMedia | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !element.isConnected) return

      mm = gsap.matchMedia()
      mm.add(
        {
          reduced: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean }

          if (reduced) {
            gsap.set(element, { opacity: 1, y: 0 })
            return
          }

          gsap.set(element, { opacity: 0, y })
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration,
            ease: ease.enter,
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
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
  }, [ref, y, duration])
}
