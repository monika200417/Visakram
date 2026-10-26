import { useLayoutEffect, useRef } from 'react'

type CountUpProps = {
  /** The final figure exactly as it is shown, e.g. "20+" or "5". */
  value: string
  className?: string
  /** Milliseconds the count takes. */
  duration?: number
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * A figure that counts up from zero the first time it scrolls into view. The element's
 * real text is always the final value — it is what renders on the server, with no
 * script, under reduced motion, in tests and wherever IntersectionObserver is missing.
 * Only where motion is welcome and the observer exists is it reset to zero (before
 * the first paint, so there is no flash of the final figure) and then counted up with a
 * direct text write per frame — never a React render.
 */
export function CountUp({ value, className, duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const match = /^(\d+)(.*)$/.exec(value)
    if (!match) return
    const target = Number(match[1])
    const suffix = match[2] ?? ''

    let frame = 0
    let started = false
    element.textContent = `0${suffix}`

    const run = () => {
      const begin = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - begin) / duration)
        element.textContent = `${Math.round(target * easeOutCubic(t))}${suffix}`
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started) {
          started = true
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      // never leave a half-counted figure behind
      element.textContent = value
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
