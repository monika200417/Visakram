import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { starPaletteFor, type StarPalette } from './starPalette'
import styles from './SiteCursor.module.css'

/**
 * The site's cursor: a white ring with a dot at its centre, and a tail of stars.
 *
 * It replaces the arrow on every page, only on devices with a real mouse or trackpad (hover + fine
 * pointer) — touch screens never see it. The native cursor is hidden by data-cursor="on" on <html>
 * (see global.css), set on the first mouse movement, so nothing is hidden if this never runs. Over text
 * fields the native cursor comes back (the I-beam matters there) and the ring steps aside.
 *
 * The ring trails the pointer a little; the dot sits exactly on it, so clicks land where it points.
 * The ring swells over anything clickable and shrinks while pressed. As the pointer travels, four-point
 * stars are dropped along its path (one for every few pixels moved); each grows from nothing,
 * twinkles, then shrinks away over about three quarters of a second, turning slowly and drifting down.
 * The stars are Visakram orange on the cream pages and gold over photographs, video and dark grounds
 * (starPaletteFor reads what is under the pointer). They are painted on one full-screen canvas that is
 * only redrawn while stars are alive, so the page is idle when the mouse is. Everything is written
 * straight to the DOM from one rAF loop — no React state per frame. With prefers-reduced-motion there
 * are no stars and the ring sits exactly on the pointer.
 */

const CLICKABLE = 'button, a, [role="button"], input, select, textarea, label, summary'
const TEXT_FIELD =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'

const SPACING = 34 // px of travel between stars
const MAX_STARS = 45
const LIFE: [number, number] = [620, 980] // ms, shortest and longest a star lives
const SIZE: [number, number] = [3, 6.5] // px radius at full size

type Star = {
  x: number
  y: number
  vx: number // drift, px over the star's life
  vy: number
  r: number
  spin: number // radians turned over the star's life
  rot: number
  born: number
  life: number
  palette: StarPalette
  color: string
}

function drawStar(ctx: CanvasRenderingContext2D, s: Star, t: number) {
  // appear -> twinkle -> disappear: a sine for the envelope, a quick shimmer on top
  const env = Math.sin(Math.PI * t)
  const shimmer = 0.85 + 0.15 * Math.sin(t * 22 + s.rot * 5)
  const k = Math.pow(env, 0.75) * shimmer
  if (k <= 0.01) return
  const R = s.r * k
  const alpha = s.palette.opacity
  ctx.save()
  ctx.translate(s.x + s.vx * t, s.y + s.vy * t)
  ctx.rotate(s.rot + s.spin * t)
  ctx.globalAlpha = Math.min(alpha, env * alpha * 1.4)
  ctx.beginPath()
  const inner = R * 0.34
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? R : inner
    const a = (Math.PI / 4) * i - Math.PI / 2
    if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad)
    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.shadowColor = s.palette.halo
  ctx.shadowBlur = 3
  ctx.fillStyle = s.color
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.lineWidth = 0.6
  ctx.strokeStyle = s.palette.edge
  ctx.stroke()
  // a pale core
  ctx.beginPath()
  ctx.arc(0, 0, R * 0.2, 0, Math.PI * 2)
  ctx.fillStyle = s.palette.core
  ctx.fill()
  ctx.restore()
}

export function SiteCursor() {
  const reducedMotion = usePrefersReducedMotion()
  // Only devices with a real pointer (hover + fine) get the cursor.
  const [capable] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const ring = ringRef.current
    const dot = dotRef.current
    if (!capable || !ring || !dot) return

    const stars: Star[] = []
    let raf = 0
    let last: { x: number; y: number } | null = null
    let carry = 0
    let px = -200 // the pointer
    let py = -200
    let rx = -200 // the ring, trailing it
    let ry = -200
    let primed = false // the ring jumps to the pointer on first sight instead of gliding in from the corner
    let overField = false // the pointer is over a text field: the native cursor takes over
    let palette: StarPalette = starPaletteFor(null)
    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d') ?? null
    const fit = () => {
      if (!canvas || !ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()

    const place = () => {
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`
    }

    const frame = (now: number) => {
      raf = 0
      // the ring trails the pointer on a soft glide (none when motion is reduced)
      const follow = reducedMotion ? 1 : 0.2
      rx += (px - rx) * follow
      ry += (py - ry) * follow
      const settled = Math.abs(px - rx) < 0.1 && Math.abs(py - ry) < 0.1
      if (settled) {
        rx = px
        ry = py
      }
      place()
      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i]
          if (!s) continue
          const t = (now - s.born) / s.life
          if (t >= 1) stars.splice(i, 1)
          else drawStar(ctx, s, t)
        }
      }
      if (!settled || stars.length) raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const drop = (x: number, y: number, speed: number) => {
      if (stars.length >= MAX_STARS) stars.shift()
      const big = Math.min(1, speed / 40)
      stars.push({
        x: x + rand(-5, 5),
        y: y + rand(-5, 5),
        vx: rand(-10, 10),
        vy: rand(4, 18),
        r: rand(SIZE[0], SIZE[1]) * (0.85 + 0.35 * big),
        spin: rand(-1.4, 1.4),
        rot: rand(0, Math.PI),
        born: performance.now(),
        life: rand(LIFE[0], LIFE[1]),
        palette,
        color: palette.colors[Math.floor(Math.random() * palette.colors.length)] ?? '#FFFFFF',
      })
    }

    const show = (on: boolean) => {
      ring.dataset.seen = on ? 'true' : 'false'
      dot.dataset.seen = on ? 'true' : 'false'
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      root.dataset.cursor = 'on'
      px = e.clientX
      py = e.clientY
      const target = e.target instanceof Element ? e.target : null
      overField = !!target?.closest(TEXT_FIELD)
      if (overField) {
        show(false)
        last = null
        return
      }
      if (!primed) {
        rx = px
        ry = py
        primed = true
      }
      show(true)
      if (!reducedMotion && ctx && last) {
        const dx = px - last.x
        const dy = py - last.y
        const d = Math.hypot(dx, dy)
        carry += d
        // one star per SPACING px, placed along the segment just travelled; the palette is read
        // from what is under the pointer, once per star
        if (carry >= SPACING) palette = starPaletteFor(target)
        while (carry >= SPACING) {
          carry -= SPACING
          const f = d ? 1 - carry / d : 1
          drop(last.x + dx * f, last.y + dy * f, d)
        }
      }
      last = { x: px, y: py }
      kick()
    }
    const over = (e: PointerEvent) => {
      const hot = !!(e.target as Element | null)?.closest?.(CLICKABLE)
      ring.dataset.hot = hot ? 'true' : 'false'
      dot.dataset.hot = hot ? 'true' : 'false'
    }
    const press = (down: boolean) => () => {
      ring.dataset.down = down ? 'true' : 'false'
      dot.dataset.down = down ? 'true' : 'false'
    }
    const pressDown = press(true)
    const pressUp = press(false)
    const leave = () => {
      show(false)
      primed = false
      last = null
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', pressDown, { passive: true })
    window.addEventListener('pointerup', pressUp, { passive: true })
    window.addEventListener('resize', fit)
    document.addEventListener('mouseleave', leave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', pressDown)
      window.removeEventListener('pointerup', pressUp)
      window.removeEventListener('resize', fit)
      document.removeEventListener('mouseleave', leave)
      delete root.dataset.cursor
    }
  }, [capable, reducedMotion])

  if (!capable) return null

  return (
    <>
      {!reducedMotion && <canvas ref={canvasRef} className={styles.stars} aria-hidden="true" />}
      <div ref={ringRef} className={styles.ringWrap} data-seen="false" aria-hidden="true">
        <div className={styles.ring} />
      </div>
      <div ref={dotRef} className={styles.dotWrap} data-seen="false" aria-hidden="true">
        <div className={styles.dot} />
      </div>
    </>
  )
}
