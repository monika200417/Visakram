import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap } from '../../../animations/gsap'
import { homeTourPinPercent } from '../../../media/home-tour/manifest'
import { homeTourTimeline } from '../../../media/home-tour/timeline'

/** Share of the pin held on the final frame before the pin releases. */
const HOLD = 0.04

type ProgressRef = RefObject<{ value: number }>
type RenderRef = RefObject<((progress: number) => void) | null>

/**
 * Drives the Home Tour with ONE ScrollTrigger and ONE normalized progress
 * value (0 → 1). A scrubbed timeline tweens a single number; every tick that
 * number is written to `progressRef`, mirrored to a `--tour-p` CSS variable
 * (the journey line and the opening title), used to pick the current chapter
 * for the copy, and handed to the media's frame driver (`renderRef`), which
 * sets the clips' `currentTime`. Because everything reads the same smoothed
 * value, the copy can never run ahead of the footage. No React state changes
 * while scrolling, and no second trigger or scroll listener exists.
 *
 * The pin length is data (the sum of the chapters' `scrollVh` in the media
 * manifest). Only runs when the media tour is active (desktop, motion
 * allowed); otherwise the section is a plain, fully static block.
 */
export function useHomeTourScrub(
  panelRef: RefObject<HTMLElement | null>,
  progressRef: ProgressRef,
  renderRef: RenderRef,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!enabled || !panel) return

    let cancelled = false
    let revert: (() => void) | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !panel.isConnected) return

      const ctx = gsap.context(() => {
        const chapters = Array.from(panel.querySelectorAll('[data-tour-chapter]'))
        const nodes = Array.from(panel.querySelectorAll('[data-tour-node]'))
        const list = panel.querySelector('[data-tour-chapters]')
        list?.setAttribute('data-scrubbing', 'true')

        const state = { value: 0 }
        let lastChapter = -1

        const setChapter = (current: number) => {
          chapters.forEach((el, i) => {
            const active = i === current
            el.setAttribute('data-active', String(active))
            el.setAttribute('aria-hidden', String(!active))
          })
          nodes.forEach((el, i) => el.setAttribute('data-active', String(i === current)))
        }
        setChapter(0)
        lastChapter = 0
        progressRef.current.value = 0
        panel.style.setProperty('--tour-p', '0')

        const sync = () => {
          const p = state.value
          progressRef.current.value = p
          panel.style.setProperty('--tour-p', p.toFixed(4))
          const chapter = homeTourTimeline.chapterIndexAt(p)
          if (chapter !== lastChapter) {
            lastChapter = chapter
            setChapter(chapter)
          }
          // Demand-driven: the media sets clip times only when progress changes.
          renderRef.current?.(p)
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: sync,
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: `+=${homeTourPinPercent}%`,
            scrub: 1,
            pin: true,
          },
        })
        tl.to(state, { value: 1, duration: 1 })
        tl.to({}, { duration: HOLD })
      }, panel)

      // The section's layout flipped from its static block to the pinned frame
      // after mount, so every trigger on the page needs re-measuring now. (The
      // module is already loaded by loadGsap, so this import costs nothing.)
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        if (!cancelled) ScrollTrigger.refresh()
      })

      revert = () => {
        ctx.revert()
        panel.querySelector('[data-tour-chapters]')?.removeAttribute('data-scrubbing')
        panel.querySelectorAll('[data-tour-chapter]').forEach((el) => {
          el.removeAttribute('data-active')
          el.removeAttribute('aria-hidden')
        })
        panel.style.removeProperty('--tour-p')
        progressRef.current.value = 0
        renderRef.current?.(0)
      }
    })

    return () => {
      cancelled = true
      revert?.()
    }
  }, [panelRef, progressRef, renderRef, enabled])
}
