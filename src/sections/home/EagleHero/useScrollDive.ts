import { useEffect, type RefObject } from 'react'
import { STAGE_W } from './heroConfig'

type DoorMeasure = { origin: string; dx: number; dy: number }

/**
 * Where the window is on screen right now, expressed for the dive: the stage-local point the zoom
 * is centred on, and the stage-local shift that carries that point to the middle of the hero. Measured
 * with the dive at rest and the camera's current tilt, so the zoom lands exactly on the window.
 */
export function measureDoor(hero: HTMLElement, stage: HTMLElement, door: HTMLElement): DoorMeasure {
  const h = door.getBoundingClientRect()
  const s = stage.getBoundingClientRect()
  const r = hero.getBoundingClientRect()
  const k = s.width / STAGE_W // the stage's own scale
  const hx = h.left + h.width / 2
  const hy = h.top + h.height / 2
  return {
    origin: `${(hx - s.left) / k}px ${(hy - s.top) / k}px`,
    dx: (r.left + r.width / 2 - hx) / k,
    dy: (r.top + r.height / 2 - hy) / k,
  }
}

/** Fired on window when the hero finishes fading away (or comes back): the header re-reads what is beneath it. */
export const HERO_STATE_EVENT = 'visakram:hero-state'

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

type ScrollDiveRefs = {
  outer: RefObject<HTMLElement | null>
  hero: RefObject<HTMLElement | null>
  stage: RefObject<HTMLElement | null>
  dive: RefObject<HTMLElement | null>
  door: RefObject<HTMLElement | null>
}

/**
 * The scroll dive. The hero is pinned (it sits sticky inside a taller outer element) while the page
 * scrolls, and scroll progress drives the zoom through the window: the scene scales up
 * exponentially about the window and glides it to the middle of the screen, the copy lets go, the last
 * stretch blurs, and the picture dissolves into the Home Tour's first frame (data-dive-finale). The
 * remaining scroll (the share after `diveShare`) fades the hero away in place over the tour pinned
 * beneath it. Scrolling back up reverses all of it.
 *
 * Native scroll only. Progress is eased toward the scroll position in one requestAnimationFrame loop
 * that sleeps when it has caught up, and every value is written straight to the elements — no React
 * state per frame. `onActive` fires only when the dive leaves or returns to rest (so the camera can
 * hold its pose while it is away). Does nothing until `enabled` (the camera has settled).
 */
export function useScrollDive(
  { outer, hero, stage, dive, door }: ScrollDiveRefs,
  enabled: boolean,
  scale: number,
  diveShare: number,
  onActive: (active: boolean) => void,
) {
  useEffect(() => {
    const outerEl = outer.current
    const heroEl = hero.current
    const stageEl = stage.current
    const diveEl = dive.current
    const doorEl = door.current
    if (!enabled || !outerEl || !heroEl || !stageEl || !diveEl || !doorEl) return
    const ui = heroEl.querySelector<HTMLElement>('[data-cam="ui"]')
    const finale = heroEl.querySelector<HTMLElement>('[data-dive-finale]')
    if (!ui || !finale) return

    // Blurring the whole zoomed scene is more than a phone's GPU can redraw every frame; the zoom and the
    // dissolve into the tour's first frame are enough there.
    const phone = window.matchMedia?.('(max-width: 767px)').matches === true

    let target = 0
    let cur = 0
    let raf = 0
    let last = 0
    let active = false
    let m: DoorMeasure | null = null
    let alive = true

    /* The hero being faded away (or back) is what turns the navigation bar solid, and it changes
       without a scroll event, so the header is told when it flips. */
    const setFaded = (faded: boolean) => {
      if ((heroEl.dataset.faded === 'true') === faded) return
      if (faded) heroEl.dataset.faded = 'true'
      else delete heroEl.dataset.faded
      window.dispatchEvent(new Event(HERO_STATE_EVENT))
    }

    const rest = () => {
      diveEl.style.transform = ''
      diveEl.style.transformOrigin = ''
      diveEl.style.filter = ''
      ui.style.opacity = ''
      finale.style.opacity = ''
      heroEl.style.opacity = ''
      heroEl.style.pointerEvents = ''
      setFaded(false)
      delete heroEl.dataset.scrolling
    }

    const apply = (progress: number) => {
      if (!m) return
      const p = clamp01(progress / diveShare)
      const fade = clamp01((progress - diveShare) / (1 - diveShare))
      const f = smooth(p)
      const blur = phone ? 0 : 7 * Math.pow(Math.max(0, (p - 0.6) / 0.4), 1.6)
      diveEl.style.transformOrigin = m.origin
      diveEl.style.transform =
        `translate(${(m.dx * f).toFixed(2)}px, ${(m.dy * f).toFixed(2)}px) ` +
        `scale(${Math.pow(scale, p).toFixed(4)})`
      diveEl.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''
      ui.style.opacity = (1 - clamp01(p / 0.15)).toFixed(3)
      finale.style.opacity = smooth(clamp01((p - 0.72) / 0.28)).toFixed(3)
      // after the zoom the hero fades away in place, and stops catching clicks meant for the tour
      heroEl.style.opacity = fade > 0 ? (1 - smooth(fade)).toFixed(3) : ''
      heroEl.style.pointerEvents = fade > 0.4 ? 'none' : ''
      // the copy's links and the window link ask for pointer events themselves, so they need to be told
      setFaded(fade > 0.4)
    }

    const measure = () => {
      // measured at rest, so the shift is relative to where the window really is
      diveEl.style.transform = ''
      diveEl.style.transformOrigin = ''
      m = measureDoor(heroEl, stageEl, doorEl)
    }

    const frame = (now: number) => {
      raf = 0
      if (!alive) return
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      cur += (target - cur) * (1 - Math.exp(-dt * 10))
      if (Math.abs(target - cur) < 0.0004) cur = target
      if (cur > 0.0004) {
        if (!active) {
          active = true
          measure()
          heroEl.dataset.scrolling = 'true'
          onActive(true)
        }
        apply(cur)
      } else if (active) {
        active = false
        m = null
        rest()
        onActive(false)
      }
      if (cur !== target) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const kick = () => {
      if (!raf && alive) raf = requestAnimationFrame(frame)
    }

    const read = () => {
      const total = outerEl.offsetHeight - heroEl.offsetHeight
      const top = outerEl.getBoundingClientRect().top
      target = total > 0 ? clamp01(-top / total) : 0
      kick()
    }
    const onResize = () => {
      if (active) {
        measure()
        apply(cur)
      }
      read()
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', onResize)
      if (active) onActive(false)
      rest()
    }
  }, [outer, hero, stage, dive, door, enabled, scale, diveShare, onActive])
}
