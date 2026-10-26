import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { getActiveStageIndex } from '../../../data/fromPlanToPlace'

/**
 * The internal 0→1 progress finishes at this fraction of the pin's own scroll
 * distance; the remainder holds the last stage briefly before the pin releases, so the
 * final stage is never yanked away the instant it is reached.
 */
const HOLD_START = 0.9

/**
 * Drives the From Plan to Place chapter's scroll emphasis. Desktop +
 * no-reduced-motion only, mirroring useVisakramWayScrub / useHeroSceneScrub: a single
 * controlled pin, scrubbed by native scroll (`scrub: 1`), never scroll-jacked. Mobile,
 * tablet and reduced motion never run this at all — every stage is simply shown in full.
 *
 * `panelRef` is the ~100svh pinned viewport (the section's `.pinnedViewport`: title,
 * caption, the six stages and the video together), so everything in it is always fully
 * on screen while pinned. On every scrub tick this moves a `data-active` attribute (and
 * `aria-current`) onto the stage that scroll position maps to — a direct, imperative
 * mutation that never calls setState, so scrolling the chapter never triggers a React
 * render (docs/ANIMATION-SYSTEM.md §29 non-negotiable #8). It does not touch the video,
 * which autoplays on its own.
 */
export function useFromPlanToPlaceScrub(panelRef: RefObject<HTMLElement | null>) {
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

        // Opt the list into the single-open-stage layout. Only set while this (desktop,
        // motion-ok) branch is active, so every other visit keeps the plain full list.
        const list = panel.querySelector('[data-stage-list]')
        list?.setAttribute('data-scrubbing', 'true')

        const setActive = (activeIndex: number) => {
          items.forEach((item, index) => {
            const active = index === activeIndex
            item.setAttribute('data-active', String(active))
            if (active) item.setAttribute('aria-current', 'step')
            else item.removeAttribute('aria-current')
          })
        }

        // Initialize before the first scrub tick so there is no flash of every stage open.
        let lastActiveIndex = 0
        setActive(0)

        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=220%',
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              const progress = Math.min(1, self.progress / HOLD_START)
              const activeIndex = Math.min(items.length - 1, getActiveStageIndex(progress))
              if (activeIndex === lastActiveIndex) return
              lastActiveIndex = activeIndex
              setActive(activeIndex)
            },
          },
        })

        return () => {
          list?.removeAttribute('data-scrubbing')
          items.forEach((item) => {
            item.removeAttribute('data-active')
            item.removeAttribute('aria-current')
          })
        }
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [panelRef])
}
