const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Carries the page from where it is to a section, over `seconds`, on one requestAnimationFrame loop
 * that writes the scroll position directly (`behavior: 'instant'`, so the global smooth-scroll rule
 * doesn't fight it). Scroll-driven effects along the way — the hero's zoom through the window — play
 * exactly as if the visitor had scrolled there. Any wheel, touch, key or pointer press hands control
 * straight back. `extra` carries it that many px past the top of the section. Returns a function that cancels the flight.
 */
export function flyToSection(target: HTMLElement, seconds: number, extra = 0): () => void {
  const from = window.scrollY
  const to = Math.round(target.getBoundingClientRect().top + window.scrollY + extra)
  const distance = to - from
  if (Math.abs(distance) < 2) return () => {}

  let raf = 0
  let start = 0
  let done = false

  const stop = () => {
    if (done) return
    done = true
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
    window.removeEventListener('pointerdown', stop)
  }

  const frame = (now: number) => {
    if (done) return
    if (!start) start = now
    const t = Math.min(1, (now - start) / (seconds * 1000))
    window.scrollTo({ top: from + distance * easeInOutCubic(t), behavior: 'instant' })
    if (t < 1) raf = requestAnimationFrame(frame)
    else stop()
  }

  window.addEventListener('wheel', stop, { passive: true })
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('keydown', stop)
  window.addEventListener('pointerdown', stop)
  raf = requestAnimationFrame(frame)
  return stop
}
