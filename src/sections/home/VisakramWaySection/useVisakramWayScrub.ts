import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'

/**
 * Pins the central visual while the active principle changes
 * (docs/ANIMATION-SYSTEM.md §14 — "one of the best candidates for
 * ScrollTrigger"). Desktop + no-reduced-motion only, mirroring
 * useHeroSceneScrub: a short controlled pin, scrubbed by native scroll,
 * never scroll-jacked. Mobile and reduced motion keep the CSS default — all
 * three principles laid out vertically, fully visible, no pin, no extra
 * scroll distance.
 */
export function useVisakramWayScrub(sectionRef: RefObject<HTMLElement | null>) {
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

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const layers = q('[data-way-layer]')
        const items = q('[data-way-item]')
        if (layers.length < 2 || items.length !== layers.length) return

        gsap.set(items, { opacity: 0.4 })
        gsap.set(items[0]!, { opacity: 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=150%',
            scrub: 1,
            pin: true,
          },
        })

        layers.forEach((layer, index) => {
          if (index === 0) return
          const previousLayer = layers[index - 1]!
          const previousItem = items[index - 1]!
          const item = items[index]!

          tl.to(previousLayer, { opacity: 0, y: -12 }, index - 1)
            .fromTo(layer, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, index - 1)
            .to(previousItem, { opacity: 0.4 }, index - 1)
            .to(item, { opacity: 1 }, index - 1)
        })
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
