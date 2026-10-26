import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

type MarqueeOptions = {
  /** The element that clips the track (pointer and focus are watched here). */
  viewportRef: RefObject<HTMLElement | null>
  /** The strip that is translated: one set of cards followed by an identical, hidden set. */
  trackRef: RefObject<HTMLElement | null>
  /** Optional elements updated imperatively as the strip moves. */
  counterRef?: RefObject<HTMLElement | null>
  progressRef?: RefObject<HTMLElement | null>
  /** How many cards are in one set. */
  count: number
  /** Auto-scroll speed in px per second, right to left. */
  speed?: number
  /** No auto-scroll, and steps are instant. */
  reducedMotion: boolean
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * A seamless, right-to-left marquee with an easing speed. All motion is a direct
 * `transform` write from one requestAnimationFrame loop — nothing here re-renders React per
 * frame. The strip is two identical sets of cards, and its offset wraps by the width of one
 * set, so it never ends and never jumps.
 *
 *  - Hover or keyboard focus on the track, a drag, the user's pause toggle, or the
 *    section being off screen, all bring the speed to zero *smoothly* (and back up the
 *    same way), so pausing and resuming never lurch.
 *  - `step(±1)` glides the strip one card either way with an eased tween, then the drift
 *    resumes from that spot — no jump.
 *  - Dragging (mouse, pen or touch swipe) moves the strip with the pointer; touch keeps
 *    vertical page scroll (`touch-action: pan-y` in the CSS).
 */
export function useMarquee({
  viewportRef,
  trackRef,
  counterRef,
  progressRef,
  count,
  speed = 60,
  reducedMotion,
}: MarqueeOptions) {
  const [userPaused, setUserPaused] = useState(false)

  const pausedRef = useRef(false)
  const stepRef = useRef<(direction: 1 | -1) => void>(() => {})

  useEffect(() => {
    pausedRef.current = userPaused
  }, [userPaused])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || typeof window === 'undefined') return

    let offset = 0 // px the strip has moved left
    let velocity = 0 // current auto speed, easing toward its target
    let loop = 0 // width of one set
    let stride = 0 // distance between one card and the next
    let hovered = false
    let focused = false
    let dragging = false
    let onScreen = true
    let frame = 0
    let last = 0
    let tween: { from: number; to: number; start: number; duration: number } | null = null
    let lastIndex = -1

    const measure = () => {
      const cards = track.querySelectorAll<HTMLElement>('[data-marquee-card]')
      const first = cards[0]
      const second = cards[1]
      const firstOfSecondSet = cards[count]
      if (!first || !firstOfSecondSet) return
      loop = firstOfSecondSet.offsetLeft - first.offsetLeft
      stride = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    }

    const wrap = (value: number) => (loop > 0 ? ((value % loop) + loop) % loop : value)

    const paint = () => {
      offset = wrap(offset)
      track.style.transform = `translate3d(${(-offset).toFixed(2)}px, 0, 0)`
      if (stride > 0) {
        const index = Math.round(offset / stride) % count
        if (index !== lastIndex) {
          lastIndex = index
          if (counterRef?.current) {
            counterRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`
          }
        }
      }
      if (progressRef?.current && loop > 0) {
        progressRef.current.style.transform = `scaleX(${(offset / loop).toFixed(4)})`
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (tween) {
        const t = Math.min(1, (now - tween.start) / tween.duration)
        offset = tween.from + (tween.to - tween.from) * easeInOutCubic(t)
        if (t >= 1) tween = null
      } else {
        const holding = hovered || focused || dragging || pausedRef.current || !onScreen
        const target = holding || reducedMotion ? 0 : speed
        // Exponential easing: the same smooth ramp down into a pause and back up out of it.
        velocity += (target - velocity) * (1 - Math.exp(-dt * 5))
        if (Math.abs(velocity) < 0.05 && target === 0) velocity = 0
        offset += velocity * dt
      }

      paint()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    stepRef.current = (direction) => {
      if (stride <= 0) return
      // Glide to the next card boundary in the chosen direction (never past it), so repeated
      // presses land on card edges and a press never overshoots.
      const from = offset
      const position = offset / stride
      const to =
        (direction === 1 ? Math.floor(position + 0.02) + 1 : Math.ceil(position - 0.02) - 1) *
        stride
      if (reducedMotion) {
        offset = to
        paint()
        return
      }
      tween = { from, to, start: performance.now(), duration: 650 }
      velocity = 0
    }

    // --- pointer / focus ---
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') hovered = true
    }
    const onLeave = () => {
      hovered = false
    }
    const onFocusIn = () => {
      focused = true
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) focused = false
    }

    let dragX = 0
    let dragOffset = 0
    let dragId = -1
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragging = true
      tween = null
      velocity = 0
      dragX = event.clientX
      dragOffset = offset
      dragId = event.pointerId
      viewport.setPointerCapture?.(event.pointerId)
      viewport.dataset.dragging = 'true'
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== dragId) return
      offset = dragOffset - (event.clientX - dragX)
    }
    const onUp = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== dragId) return
      dragging = false
      viewport.releasePointerCapture?.(event.pointerId)
      delete viewport.dataset.dragging
    }

    viewport.addEventListener('pointerenter', onEnter)
    viewport.addEventListener('pointerleave', onLeave)
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)
    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)

    const resizer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            measure()
            paint()
          })
        : undefined
    resizer?.observe(track)
    resizer?.observe(viewport)

    // Off screen: no frames at all (the loop is stopped, not just idle).
    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(([entry]) => {
            onScreen = Boolean(entry?.isIntersecting)
            if (onScreen) start()
            else stop()
          })
        : undefined
    observer?.observe(viewport)

    measure()
    paint()
    if (!observer) start()

    return () => {
      stop()
      observer?.disconnect()
      resizer?.disconnect()
      viewport.removeEventListener('pointerenter', onEnter)
      viewport.removeEventListener('pointerleave', onLeave)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      track.style.transform = ''
      delete viewport.dataset.dragging
      stepRef.current = () => {}
    }
  }, [viewportRef, trackRef, counterRef, progressRef, count, speed, reducedMotion])

  const step = useCallback((direction: 1 | -1) => stepRef.current(direction), [])
  const toggle = useCallback(() => setUserPaused((paused) => !paused), [])

  return { step, userPaused, toggle }
}
