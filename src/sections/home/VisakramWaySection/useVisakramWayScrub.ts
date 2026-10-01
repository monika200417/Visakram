import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { getWayBeatIndex, getWayChapterIndex, wayBeatStarts } from '../../../data/visakramWay'

/** Extra timeline units held after the last chapter completes, before the pin releases. */
const HOLD_UNITS = 0.3

/**
 * Drives The Visakram Way's pinned cinematic story
 * (docs/ANIMATION-SYSTEM.md §14). Desktop + no-reduced-motion only: one
 * controlled pin, scrubbed by native scroll, never scroll-jacked. Mobile and
 * reduced motion never run this — the section keeps its plain, fully
 * visible vertical list.
 *
 * `panelRef` is the ~100svh `.pinned` wrapper holding the visual and the
 * copy, so the whole composition is on screen for the entire pin.
 *
 * One ScrollTrigger drives everything. A scrubbed timeline of N chapter
 * units (+ a short hold) animates the visual: layer cross-fades, a subtle
 * crop movement, beat reveals and the progress fill. The same trigger's
 * normalized progress feeds `getWayChapterIndex` / `getWayBeatIndex` in
 * `onUpdate`, which only flip `data-active` / `aria-hidden` attributes when
 * the chapter or beat actually changes — no React state, no second scroll
 * system, no per-frame renders (docs/ANIMATION-SYSTEM.md §29 #8).
 */
export function useVisakramWayScrub(panelRef: RefObject<HTMLElement | null>) {
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
        const layers = q('[data-way-layer]')
        const items = q('[data-way-item]')
        const navItems = q('[data-way-nav]')
        const labels = q('[data-way-beat-label]')
        const fill = q('[data-way-fill]')[0]
        const list = q('[data-way-list]')[0]
        const count = layers.length
        if (count < 2 || items.length !== count || !fill) return

        list?.setAttribute('data-scrubbing', 'true')

        const setActive = (chapter: number, beat: number) => {
          items.forEach((item, i) => {
            const active = i === chapter
            item.setAttribute('data-active', String(active))
            item.setAttribute('aria-hidden', String(!active))
          })
          navItems.forEach((item, i) => item.setAttribute('data-active', String(i === chapter)))
          labels.forEach((label, i) =>
            label.setAttribute('data-active', String(i === chapter * 3 + beat)),
          )
        }

        let lastChapter = 0
        let lastBeat = 0
        setActive(0, 0)

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=270%',
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              // Normalized 0→1 over the chapters; the tail of the pin is a
              // hold on the finished third chapter.
              const progress = Math.min(1, self.progress / (count / (count + HOLD_UNITS)))
              const chapter = getWayChapterIndex(progress, count)
              const beat = getWayBeatIndex(progress, count)
              if (chapter === lastChapter && beat === lastBeat) return
              lastChapter = chapter
              lastBeat = beat
              setActive(chapter, beat)
            },
          },
        })

        layers.forEach((layer, i) => {
          const media = layer.querySelector('[data-way-media]')
          const beats = Array.from(layer.querySelectorAll('[data-way-beat]'))

          if (i > 0) {
            tl.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.2 }, i - 0.1)
            tl.to(layers[i - 1]!, { opacity: 0, duration: 0.2 }, i - 0.1)
          }

          if (media) {
            tl.fromTo(
              media,
              { scale: 1.08, xPercent: 1.5 },
              { scale: 1, xPercent: -1.5, duration: 1 },
              i,
            )
          }

          beats.forEach((beat, k) => {
            if (k === 0) return
            const at = i + (wayBeatStarts[k] ?? 0)
            tl.fromTo(
              beat,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' },
              at,
            )
            tl.to(beats[k - 1]!, { opacity: 0.5, duration: 0.2 }, at)
          })
        })

        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: count }, 0)
        tl.to({}, { duration: HOLD_UNITS }, count)

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
  }, [panelRef])
}
