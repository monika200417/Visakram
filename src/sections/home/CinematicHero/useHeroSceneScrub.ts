import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'

/**
 * Scrubs the layered scene stack as the visitor scrolls through the hero
 * (Milestone 3 spec §6/§7 — "Image Transition Concept" / scroll behavior).
 * Desktop/tablet + no-reduced-motion only: a short, controlled pin (~0.9 of
 * one viewport of extra scroll), never scroll-jacked — native scroll drives
 * it via `scrub`. Mobile and reduced motion keep HeroVisualStage's CSS
 * default (first scene, fully static, no pin, no extra scroll distance).
 */
export function useHeroSceneScrub(sectionRef: RefObject<HTMLElement | null>) {
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

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const layers = q('[data-hero-layer]')
        const content = q('[data-hero="content"]')
        if (layers.length < 2) return

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=90%',
            scrub: 1,
            pin: true,
          },
        })

        layers.forEach((layer, index) => {
          if (index === 0) return
          const previous = layers[index - 1]!
          tl.to(previous, { opacity: 0, scale: 1.04 }, index - 1).fromTo(
            layer,
            { scale: 1.04 },
            { opacity: 1, scale: 1 },
            index - 1,
          )
        })

        tl.to(content, { opacity: 0.85, y: -16 }, layers.length - 1)
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
