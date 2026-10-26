type Gsap = (typeof import('gsap'))['gsap']
export type GsapMatchMedia = ReturnType<Gsap['matchMedia']>

let modulePromise: Promise<{ gsap: Gsap }> | null = null

/**
 * Dynamically imports GSAP + ScrollTrigger and registers the plugin once.
 * Called lazily from inside animation hooks so GSAP never lands in the
 * shared/initial bundle — only the chapters that actually animate pay for it
 * (docs/PERFORMANCE-BUDGET.md §5 — "Do not load every animation module
 * immediately"). Real page content never waits on this: components render
 * their final markup synchronously and GSAP only progressively enhances it.
 */
export function loadGsap(): Promise<{ gsap: Gsap }> {
  if (!modulePromise) {
    modulePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        // On phones the address bar slides away as the page scrolls, which resizes the window. Without this,
        // every one of those resizes re-measures every pin mid-scroll and the page visibly jumps. Pinned
        // stages are sized in svh, so they do not need the re-measure.
        ScrollTrigger.config({ ignoreMobileResize: true })
        return { gsap }
      },
    )
  }
  return modulePromise
}
