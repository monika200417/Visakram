import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { getActiveStageIndex } from '../../../data/fromPlanToPlace'

type ProgressRef = RefObject<{ value: number }>

/**
 * The internal 0→1 animation finishes at this fraction of the pin's own
 * scroll distance; the remainder holds the completed PLACE composition
 * (camera + construction progress both stay clamped at 1) before the pin
 * releases, so the finished building is never yanked away the instant it
 * completes — "hold the final PLACE composition briefly, then release
 * naturally into the next section."
 */
const HOLD_START = 0.88

/**
 * Drives the From Plan to Place chapter's scroll story (Milestone 10 §8,
 * §9, §22; revised §22 to fix a pinned-viewport overflow bug). Desktop +
 * no-reduced-motion only, mirroring useVisakramWayScrub / useHeroSceneScrub:
 * a single controlled pin, scrubbed by native scroll (`scrub: 1`), never
 * scroll-jacked. Mobile and reduced motion never run this hook at all —
 * FromPlanToPlaceSection renders the static HTML/CSS fallback for those
 * instead, so this hook has nothing to do there.
 *
 * `panelRef` is the ~100svh pinned viewport (FromPlanToPlaceSection's
 * `.pinnedViewport` wrapper around the visual + stage-text composition),
 * not the outer `<section>`. The outer section holds the chapter's
 * intro copy (eyebrow/heading/disclaimer) in normal flow above the panel
 * and supplies the scroll distance GSAP's pin spacer needs — but it is
 * itself taller than one viewport, so pinning it directly (the previous
 * approach) left part of the composition permanently off-screen for the
 * whole scrub. Pinning the viewport-sized panel instead means everything
 * inside it is always fully on screen, at any tested viewport size, by
 * construction (see FromPlanToPlaceSection.module.css's desktop block).
 *
 * On every scrub tick this writes a normalized 0–1 progress value into
 * `progressRef.current.value` (read by BuildingScene's useFrame loop) and
 * toggles a `data-active` attribute on the matching HTML stage item —
 * both are direct, imperative mutations. Neither ever calls setState, so
 * scrolling this chapter never triggers a React render
 * (docs/ANIMATION-SYSTEM.md §29 non-negotiable #8). Text, camera and
 * construction geometry all read the same `progressRef` value (via
 * `activeIndex`, computed from it below), so they can never drift out of
 * sync with each other.
 */
export function useFromPlanToPlaceScrub(
  panelRef: RefObject<HTMLElement | null>,
  progressRef: ProgressRef,
) {
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    let cancelled = false
    let mm: GsapMatchMedia | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !panel.isConnected) return

      const q = gsap.utils.selector(panel)
      mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const items = q('[data-stage-item]')
        if (items.length === 0) return

        let lastActiveIndex = -1

        // Opt the list into the stacked single-stage layout. Only set while
        // this (desktop, motion-ok) branch is active, so the static
        // fallback and reduced motion keep the plain readable list.
        const list = panel.querySelector('[data-stage-list]')
        list?.setAttribute('data-scrubbing', 'true')

        // Initialize before the first scrub tick so there is no flash of
        // every stage stacked/visible before GSAP/ScrollTrigger settles.
        items.forEach((item, index) => {
          const active = index === 0
          item.setAttribute('data-active', String(active))
          item.setAttribute('aria-hidden', String(!active))
        })
        lastActiveIndex = 0

        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=160%',
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              // The internal animation reaches 1 at HOLD_START of the
              // pin's own scroll distance, then stays clamped at 1 for
              // the rest — the "brief hold" on the finished composition.
              const animatedProgress = Math.min(1, self.progress / HOLD_START)
              progressRef.current.value = animatedProgress

              const activeIndex = Math.min(items.length - 1, getActiveStageIndex(animatedProgress))
              if (activeIndex === lastActiveIndex) return
              lastActiveIndex = activeIndex
              items.forEach((item, index) => {
                const active = index === activeIndex
                item.setAttribute('data-active', String(active))
                item.setAttribute('aria-hidden', String(!active))
              })
            },
          },
        })

        return () => {
          list?.removeAttribute('data-scrubbing')
          items.forEach((item) => {
            item.removeAttribute('data-active')
            item.removeAttribute('aria-hidden')
          })
        }
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [panelRef, progressRef])
}
