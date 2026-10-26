import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import {
  CAM_PERSPECTIVE,
  CAM_PUSH,
  CAM_TILT_X,
  CAM_TILT_Y,
  EYE_X,
  HEAD_CLEAR,
  HEAD_Y,
  SETTLE_AT,
  STAGE_H,
  STAGE_W,
  UI_SHIFT_X,
  UI_SHIFT_Y,
  UI_TILT_X,
  UI_TILT_Y,
} from './heroConfig'

/**
 * Sizes the 1920x1080 scene stage to cover the hero. Writes two CSS variables on the hero element
 * (--stage-scale, --stage-left, --stage-drop) when it resizes; nothing re-renders.
 *
 * The stage is anchored to the bottom, so on windows wider than 16:9 the crop comes off the sky and
 * the building and the eagle's feet stay in view. On narrower windows it is shifted sideways to keep
 * the eagle (EYE_X) near the middle, without ever showing an empty edge. It is also lowered a little
 * (--stage-drop) whenever the crop would cut the eagle's head or push it under the header.
 */
export function useStageFit(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      const s = Math.max(w / STAGE_W, h / STAGE_H)
      const left = Math.min(0, Math.max(w - STAGE_W * s, w / 2 - EYE_X * s))
      el.style.setProperty('--stage-scale', String(s))
      el.style.setProperty('--stage-left', `${left}px`)
      // bottom-anchored, the stage's top edge is at h - STAGE_H*s (above the window when it is cropped);
      // lower it, as far as it has room, until the eagle's head clears the header
      const top = h - STAGE_H * s
      const headTop = top + HEAD_Y * s
      const drop = Math.max(0, Math.min(HEAD_CLEAR - headTop, -top))
      el.style.setProperty('--stage-drop', `${drop}px`)
    }
    fit()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [root])
}

/**
 * The 3D camera. Once the page has settled (`armed`, and SETTLE_AT seconds after), the scene tilts
 * in perspective toward the pointer and the page content floats a touch the other way, so the page
 * reads as a slow camera move. All motion is written straight to the two layers
 * ([data-cam="scene"], [data-cam="ui"]) from one requestAnimationFrame loop that sleeps when the
 * pointer is still and the hero is off screen — no React state per frame.
 */
export function useHeroCamera(
  root: RefObject<HTMLElement | null>,
  armed: boolean,
  frozen: boolean,
) {
  // While frozen (the dive) the camera holds its last pose and ignores the pointer.
  const frozenRef = useRef(frozen)
  useEffect(() => {
    frozenRef.current = frozen
  }, [frozen])

  useEffect(() => {
    const el = root.current
    if (!el || !armed) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const scene = el.querySelector<HTMLElement>('[data-cam="scene"]')
    const ui = el.querySelector<HTMLElement>('[data-cam="ui"]')
    if (!scene || !ui) return

    let tx = 0 // pointer target, -1..1 about the centre of the window
    let ty = 0
    let cx = 0 // smoothed
    let cy = 0
    let live = 0 // eases 0 -> 1 once settled
    let liveFrom = 0
    let liveStart = 0
    let raf = 0
    let last = 0
    let visible = true
    let alive = true

    const apply = () => {
      const k = el.clientWidth / STAGE_W
      scene.style.transform =
        `perspective(${CAM_PERSPECTIVE}px) rotateX(${(-cy * live * CAM_TILT_X).toFixed(3)}deg) ` +
        `rotateY(${(cx * live * CAM_TILT_Y).toFixed(3)}deg) scale(${(1 + (CAM_PUSH - 1) * live).toFixed(4)})`
      ui.style.transform =
        `perspective(${CAM_PERSPECTIVE}px) translate3d(${(-cx * live * UI_SHIFT_X * k).toFixed(2)}px, ` +
        `${(-cy * live * UI_SHIFT_Y * k).toFixed(2)}px, 0) rotateX(${(-cy * live * UI_TILT_X).toFixed(3)}deg) ` +
        `rotateY(${(cx * live * UI_TILT_Y).toFixed(3)}deg)`
    }

    const frame = (now: number) => {
      raf = 0
      if (!alive || !visible) return
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      // a slow glide: the camera lags the pointer
      const f = 1 - Math.exp(-dt * 3.4)
      cx += (tx - cx) * f
      cy += (ty - cy) * f
      let moving = Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005
      if (liveStart) {
        const p = Math.min(1, (now - liveStart) / 1800)
        const eased = 1 - Math.pow(1 - p, 3)
        live = liveFrom + (1 - liveFrom) * eased
        if (p < 1) moving = true
        else liveStart = 0
      }
      apply()
      if (moving) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const kick = () => {
      if (!raf && alive && visible) raf = requestAnimationFrame(frame)
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || frozenRef.current) return
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      kick()
    }
    const leave = () => {
      if (frozenRef.current) return
      tx = 0
      ty = 0
      kick()
    }

    const settle = window.setTimeout(() => {
      liveFrom = live
      liveStart = performance.now()
      kick()
    }, SETTLE_AT * 1000)

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true
            if (visible) kick()
          })
        : null
    io?.observe(el)

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      alive = false
      window.clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
      scene.style.transform = ''
      ui.style.transform = ''
    }
  }, [root, armed])
}
