import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { ease, motion } from '../../../animations/motion-tokens'

/**
 * One-time entrance reveal: meta label -> headline -> supporting copy -> CTA
 * -> scroll indicator, staggered per docs/ANIMATION-SYSTEM.md §6 ("Hero
 * Motion — entrance sequence"). Reduced motion sets the final state
 * immediately with no timeline.
 */
export function useHeroEntrance(sectionRef: RefObject<HTMLElement | null>) {
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
          const { reduced } = context.conditions as { reduced: boolean }
          const targets = {
            meta: q('[data-hero="meta"]'),
            headline: q('[data-hero="headline"]'),
            supporting: q('[data-hero="supporting"]'),
            cta: q('[data-hero="cta"]'),
            indicator: q('[data-hero="indicator"]'),
          }

          if (reduced) {
            gsap.set(Object.values(targets).flat(), { opacity: 1, y: 0 })
            return
          }

          gsap.set(targets.meta, { opacity: 0, y: 12 })
          gsap.set(targets.headline, { opacity: 0, y: 28 })
          gsap.set(targets.supporting, { opacity: 0, y: 20 })
          gsap.set(targets.cta, { opacity: 0, y: 16 })
          gsap.set(targets.indicator, { opacity: 0 })

          gsap
            .timeline({ defaults: { ease: ease.enter } })
            .to(targets.meta, { opacity: 1, y: 0, duration: motion.ui }, 0.1)
            .to(targets.headline, { opacity: 1, y: 0, duration: motion.cinematic }, 0.25)
            .to(targets.supporting, { opacity: 1, y: 0, duration: motion.editorial }, 0.55)
            .to(targets.cta, { opacity: 1, y: 0, duration: motion.editorial }, 0.7)
            .to(targets.indicator, { opacity: 1, duration: motion.editorial }, 0.85)
        },
      )
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
