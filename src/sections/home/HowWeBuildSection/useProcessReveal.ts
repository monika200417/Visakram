import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'

/**
 * How We Build's entrance: the five cards start as one pile at the centre of the row, slightly fanned
 * as a dealt deck is, and when the section scrolls into view they are dealt out to their places, one
 * after another, outward to both sides, over three seconds. No pin, no scrub — native scroll is
 * untouched. It plays every time the row comes back into view: the cards are put back on the pile
 * only while the row is completely out of sight (so nothing is seen to snap back), and the deal
 * starts once a quarter of the row is on screen, scrolling in from either direction. The pile is set
 * up straight away (before the section is seen), so nothing jumps when it arrives.
 *
 * Every step is real text in normal document flow either way; with reduced motion the cards are simply
 * in place and nothing moves.
 *
 * The pile is measured from layout (offsetLeft/offsetTop are untouched by transforms) and the numbers
 * are functions, so a resize or a change of column count (five across, two, one) re-aims the pile at
 * the new centre.
 */

/** The order the cards leave the pile: the far left, the far right, then inward, the middle last. */
const DEAL_ORDER = [0, 4, 1, 3, 2]
/** The whole deal takes this long: the last card starts at (n-1) * STAGGER and runs for DURATION. */
const TOTAL = 3
const DURATION = 1.1

/** A small fan so the pile reads as a pile: each card's turn (degrees) and nudge (px), by card. */
const PILE_TURN = [-7, -3.5, 0, 3.5, 7]
const PILE_NUDGE = [-6, -3, 0, 3, 6]

export function useProcessReveal(sectionRef: RefObject<HTMLElement | null>) {
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
          const steps = q('[data-step]') as HTMLElement[]
          const { reduced } = context.conditions as { reduced: boolean }

          if (reduced || steps.length === 0) {
            gsap.set(steps, { clearProps: 'all' })
            return
          }

          const row = steps[0]?.parentElement as HTMLElement
          const n = steps.length
          // where the pile sits: the centre of the row, on both axes
          const toCentre = (el: HTMLElement) => ({
            x: row.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
            y: row.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
          })
          const stagger = (TOTAL - DURATION) / Math.max(1, n - 1)

          // the top of the pile is the first card to be dealt
          steps.forEach((el, i) => {
            const order = DEAL_ORDER.indexOf(i)
            gsap.set(el, { zIndex: n - order, transformOrigin: '50% 60%' })
          })

          // the pile pose of one card (the same numbers the deal starts from)
          const pile = (cardIndex: number, el: HTMLElement) => ({
            x: toCentre(el).x + (PILE_NUDGE[cardIndex] ?? 0),
            y: toCentre(el).y + (2 - cardIndex) * 2,
            rotation: PILE_TURN[cardIndex] ?? 0,
            scale: 0.94,
          })

          // paused: the observer below starts it
          const tl = gsap.timeline({ paused: true })

          DEAL_ORDER.forEach((cardIndex, k) => {
            const el = steps[cardIndex]
            if (!el) return
            tl.fromTo(
              el,
              {
                x: () => pile(cardIndex, el).x,
                y: () => pile(cardIndex, el).y,
                rotation: PILE_TURN[cardIndex] ?? 0,
                scale: 0.94,
              },
              {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                duration: DURATION,
                ease: 'power3.out',
              },
              k * stagger,
            )
          })

          // Out of sight -> back on the pile (re-measured, in case the layout changed) and armed.
          // A quarter in view -> deal, once per visit.
          // without IntersectionObserver there is no way to know: just deal
          if (typeof IntersectionObserver === 'undefined') {
            tl.play()
            return
          }
          let armed = true
          const io = new IntersectionObserver(
            ([entry]) => {
              if (!entry) return
              if (entry.intersectionRatio === 0) {
                if (!armed) {
                  tl.invalidate().progress(0).pause()
                  // every card, not just the first, goes back to the pile (a timeline only
                  // rewinds the tweens that have already begun)
                  steps.forEach((el, i) => gsap.set(el, pile(i, el)))
                  armed = true
                }
              } else if (armed && entry.intersectionRatio >= 0.25) {
                armed = false
                tl.invalidate().restart()
              }
            },
            { threshold: [0, 0.25] },
          )
          io.observe(row)

          return () => io.disconnect()
        },
      )
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
