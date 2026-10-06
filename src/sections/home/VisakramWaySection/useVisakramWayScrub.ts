import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import {
  getWayChapterIndex,
  getWayStageIndex,
  getWayVisual,
  visakramWayPrinciples,
} from '../../../data/visakramWay'

/** Extra timeline units held after the last chapter completes, before the pin releases. */
const HOLD_UNITS = 0.3

type Part = HTMLElement | SVGElement

const num = (value: string | undefined, fallback: number) => {
  const n = Number(value)
  return value === undefined || Number.isNaN(n) ? fallback : n
}

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
 * crop movement, and every element a chapter's SVG marks up with the
 * `data-way-*` attributes from wayLinework.ts (reveal / draw / exit / shift
 * / depth), each placed at its chapter-local fraction. The same trigger's
 * normalized progress feeds `getWayChapterIndex` / `getWayStageIndex` in
 * `onUpdate`, which only flip `data-active` / `aria-hidden` attributes when
 * the chapter or stage actually changes — no React state, no second scroll
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
        const rows = q('[data-way-stage-row]')
        const fill = q('[data-way-fill]')[0]
        const list = q('[data-way-list]')[0]
        const count = layers.length
        if (count < 2 || items.length !== count || rows.length !== count || !fill) return

        list?.setAttribute('data-scrubbing', 'true')

        // Stage captions are flattened across chapters; remember where each
        // chapter's block starts and which stage starts it has.
        const stagesByChapter = visakramWayPrinciples.map((p) => getWayVisual(p.title).stages)
        const labelOffset = stagesByChapter.map((_, i) =>
          stagesByChapter.slice(0, i).reduce((sum, st) => sum + st.length, 0),
        )

        const setActive = (chapter: number, stage: number) => {
          items.forEach((item, i) => {
            const active = i === chapter
            item.setAttribute('data-active', String(active))
            item.setAttribute('aria-hidden', String(!active))
          })
          navItems.forEach((item, i) => item.setAttribute('data-active', String(i === chapter)))
          rows.forEach((row, i) => row.setAttribute('data-active', String(i === chapter)))
          const activeLabel = (labelOffset[chapter] ?? 0) + stage
          labels.forEach((label, i) => label.setAttribute('data-active', String(i === activeLabel)))
        }

        let lastChapter = 0
        let lastStage = 0
        setActive(0, 0)

        // Text, nav, stage rows and labels all follow the SAME value the visuals
        // do: the scrubbed timeline's own time. (Driving them from raw scroll
        // instead made the copy run up to a scrub-lag ahead of the artwork.)
        const sync = () => {
          const progress = Math.min(1, tl.time() / count)
          const chapter = getWayChapterIndex(progress, count)
          const stage = getWayStageIndex(progress, count, stagesByChapter[chapter] ?? [])
          if (chapter === lastChapter && stage === lastStage) return
          lastChapter = chapter
          lastStage = stage
          setActive(chapter, stage)
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: sync,
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=270%',
            scrub: 1,
            pin: true,
          },
        })

        layers.forEach((layer, i) => {
          const parts = <T extends Part = Part>(selector: string) =>
            Array.from(layer.querySelectorAll<T>(selector))

          if (i > 0) {
            // A short crossfade centred on the chapter boundary — the same
            // instant the copy and stage row switch. autoAlpha also hides the
            // inactive chapter outright (visibility), so it is never painted.
            tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, i - 0.06)
            tl.to(layers[i - 1]!, { autoAlpha: 0, duration: 0.12 }, i - 0.06)
          }

          // Crop movement on the media wrapper (SVG artwork or future client media).
          const media = layer.querySelector('[data-way-media]')
          if (media) {
            tl.fromTo(
              media,
              { scale: 1.05, xPercent: 1 },
              { scale: 1, xPercent: -1, duration: 1 },
              i,
            )
          }

          // Parallax: background groups drift a touch against the artwork.
          parts('[data-way-depth]').forEach((el) => {
            const d = num(el.dataset.wayDepth, 1) * 6
            tl.fromTo(el, { x: d }, { x: -d, duration: 1 }, i)
          })

          // Reveal (and optionally line-draw) at a chapter-local fraction.
          parts('[data-way-reveal]').forEach((el) => {
            const local = num(el.dataset.wayAt, 0)
            // The opening chapter's base environment is already in place when the
            // pin begins, so entering the section never shows an empty frame.
            if (i === 0 && local <= 0.02) return
            const at = i + local
            const dur = num(el.dataset.wayDur, 0.2)
            if (el.hasAttribute('data-way-draw')) {
              const strokes = Array.from(
                el.querySelectorAll('line, polyline, polygon, path, rect, circle'),
              )
              strokes.forEach((s) => s.setAttribute('pathLength', '1'))
              tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur * 0.4 }, at)
              tl.fromTo(
                strokes,
                { strokeDasharray: 1, strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  duration: dur * 0.5,
                  stagger: { amount: dur * 0.5 },
                },
                at,
              )
            } else if (el.hasAttribute('data-way-grow')) {
              // Rising element: scales up from its own base.
              tl.fromTo(
                el,
                { opacity: 0, scaleY: 0, transformOrigin: '50% 100%' },
                { opacity: 1, scaleY: 1, duration: dur, ease: 'power1.out' },
                at,
              )
            } else if (el.hasAttribute('data-way-from')) {
              // Dropping/sliding element: arrives from an offset.
              tl.fromTo(
                el,
                { opacity: 0, y: num(el.dataset.wayFrom, 0) },
                { opacity: 1, y: 0, duration: dur, ease: 'power1.out' },
                at,
              )
            } else {
              tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur }, at)
            }
          })

          // Retract (e.g. alignment connectors once layers converge).
          parts('[data-way-exit]').forEach((el) => {
            tl.to(el, { opacity: 0, duration: 0.1 }, i + num(el.dataset.wayExit, 1))
          })

          // Move down (e.g. the exploded layers closing into the finished stack).
          parts('[data-way-shift]').forEach((el) => {
            tl.to(
              el,
              { y: num(el.dataset.wayShift, 0), duration: 0.1, ease: 'power1.inOut' },
              i + num(el.dataset.wayShiftAt, 0.9),
            )
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
