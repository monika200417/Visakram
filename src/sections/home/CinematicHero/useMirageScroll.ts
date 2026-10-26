import { useEffect, type RefObject } from 'react'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
/** ease-in-out */
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

/**
 * The outer element is 620svh: 520svh of scroll in all. The film runs through the first 420svh
 * of it; the last 100svh holds the finished closing screen — the mark at its largest — before
 * the pin releases and the page carries on. (The template's film ran the whole distance.)
 */
const FILM_FRACTION = 420 / 520

/**
 * The hero's scroll film: one requestAnimationFrame loop reads the scroll progress of the
 * hero's own tall outer element (never React state) and writes every layer's transform and
 * opacity directly — the background and clouds drift and swell, a glow blooms, the portal
 * zooms to eight times its size, the hero copy fades away, and the closing call to action,
 * with the Visakram mark at its centre, arrives as the portal fills the screen. A smoothed
 * mouse position tilts the layers a few pixels for parallax.
 *
 * `sp` is the raw 0–1 progress through the outer element and `ep` its ease-in-out; the maths
 * is the studied template's, unchanged. The loop only runs while the hero is on screen. With
 * `enabled` false (reduced motion) nothing animates: the layers stay at their first frame.
 */
export function useMirageScroll(outerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const outer = outerRef.current
    if (!outer || typeof window === 'undefined') return

    // The layers are found by their data-layer attribute, so the hook needs only the outer ref.
    const layer = (name: string) => outer.querySelector<HTMLElement>(`[data-layer="${name}"]`)

    const target = { x: 0, y: 0 }
    const mouse = { x: 0, y: 0 }
    let frame = 0

    const apply = (raw: number) => {
      const sp = clamp(raw / FILM_FRACTION, 0, 1)
      const hold = clamp((raw - FILM_FRACTION) / (1 - FILM_FRACTION), 0, 1)
      const ep = ease(sp)
      const rx = mouse.x
      const ry = mouse.y

      const bg = layer('bg')
      if (bg) {
        const scale = lerp(1.0, 1.22, sp)
        bg.style.transform = `scale(${scale}) translate3d(${rx * 8}px,${ry * 8}px,0)`
      }

      const glow = layer('glow')
      if (glow) {
        const glowSize = lerp(200, 800, ep)
        const glowIn = clamp(sp / 0.55, 0, 1)
        const glowOut = 1 - clamp((sp - 0.55) / 0.3, 0, 1)
        glow.style.width = glow.style.height = `${glowSize}px`
        glow.style.opacity = String(lerp(0.35, 0.9, glowIn) * glowOut)
      }

      const portal = layer('portal')
      if (portal) {
        const scale = lerp(1, 8, ep)
        const px = rx * (5 / Math.max(scale, 1))
        const py = ry * (5 / Math.max(scale, 1))
        portal.style.transform = `translate(-50%,-50%) scale(${scale}) translate3d(${px}px,${py}px,0)`
      }

      const clouds = layer('clouds')
      if (clouds) {
        const cloudScale = lerp(1.0, 2.6, ep)
        const cloudY = lerp(0, 420, ep)
        clouds.style.transform = `scale(${cloudScale}) translate3d(${rx * 10}px,${cloudY + ry * 10}px,0)`
      }

      const hero = layer('hero')
      if (hero) {
        const heroOpacity = clamp(1 - sp / 0.28, 0, 1)
        hero.style.opacity = String(heroOpacity)
        // once faded out, its links must not stay clickable over the closing screen
        hero.style.visibility = heroOpacity < 0.02 ? 'hidden' : 'visible'
        hero.style.transform = `translateY(${sp * -40}px)`
      }

      const cta = layer('cta')
      if (cta) {
        const o = clamp((sp - 0.45) / 0.3, 0, 1)
        const scale = lerp(0.6, 1.0, clamp((sp - 0.45) / 0.55, 0, 1))
        cta.style.opacity = String(o)
        cta.style.transform = `scale(${scale})`
        cta.style.pointerEvents = o > 0.05 ? 'auto' : 'none'
      }

      const overlay = layer('overlay')
      if (overlay) overlay.style.opacity = String(clamp((sp - 0.9) / 0.1, 0, 1))

      // The mark arrives last, at the centre, once the portal has filled the screen, then keeps
      // growing a little through the hold so it stands as large as it will.
      const logo = layer('logo')
      if (logo) {
        const o = clamp((sp - 0.6) / 0.25, 0, 1)
        const scale = lerp(0.8, 1, ease(o)) * (1 + 0.05 * ease(hold))
        logo.style.opacity = String(o)
        logo.style.transform = `scale(${scale})`
      }
    }

    const progress = () => {
      const rect = outer.getBoundingClientRect()
      const scrollable = outer.offsetHeight - window.innerHeight
      return scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
    }

    if (!enabled) {
      apply(0)
      return
    }

    const tick = () => {
      mouse.x += (target.x - mouse.x) * 0.06
      mouse.y += (target.y - mouse.y) * 0.06
      apply(progress())
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const onMove = (event: MouseEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)

    // No frames at all while the hero is scrolled well away.
    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) start()
              else stop()
            },
            { rootMargin: '100px 0px' },
          )
        : undefined
    observer?.observe(outer)
    if (!observer) start()
    apply(progress())

    return () => {
      stop()
      observer?.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [outerRef, enabled])
}
