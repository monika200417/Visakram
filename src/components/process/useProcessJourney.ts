import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../animations/gsap'

/**
 * The Process page's one scroll behavior (docs/ANIMATION-SYSTEM.md §16: an
 * active stage and a progress line that advances — not five unrelated
 * animations). ONE scrubbed ScrollTrigger on the journey list drives a
 * transform-only progress line, and marks each stage `reached` or `pending`
 * (and the latest reached one `active`) by writing a data attribute directly
 * on the element — never React state per scroll frame. No pin, no hijacked
 * scroll, nothing is hidden: a pending stage is only quieter, never absent.
 *
 * Without JavaScript, or under `prefers-reduced-motion: reduce`, the stages
 * carry no state attribute and the line is drawn in full — the finished
 * journey, every stage fully readable.
 */
export function useProcessJourney(
  listRef: RefObject<HTMLElement | null>,
  progressRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const list = listRef.current
    const progress = progressRef.current
    if (!list || !progress || typeof window === 'undefined') return
    if (typeof window.matchMedia !== 'function') return

    let cancelled = false
    let mm: GsapMatchMedia | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !list.isConnected) return

      const stages = Array.from(list.querySelectorAll<HTMLElement>('[data-stage]'))
      if (stages.length === 0) return

      mm = gsap.matchMedia()
      mm.add(
        {
          reduced: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean }

          if (reduced) {
            gsap.set(progress, { scaleY: 1 })
            return
          }

          let offsets = stages.map((stage) => stage.offsetTop)
          let current = -1

          const mark = (value: number) => {
            const reachedAt = value * list.offsetHeight
            let active = 0
            offsets.forEach((offset, i) => {
              if (offset <= reachedAt) active = i
            })
            if (active === current) return
            current = active
            stages.forEach((stage, i) => {
              stage.dataset.state = i === active ? 'active' : i < active ? 'reached' : 'pending'
            })
          }

          gsap.set(progress, { scaleY: 0, transformOrigin: 'top' })
          mark(0)
          gsap.to(progress, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: list,
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: true,
              onRefresh: () => {
                offsets = stages.map((stage) => stage.offsetTop)
              },
              onUpdate: (self) => mark(self.progress),
            },
          })

          return () => {
            stages.forEach((stage) => delete stage.dataset.state)
          }
        },
      )
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [listRef, progressRef])
}
