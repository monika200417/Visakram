import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap, type GsapMatchMedia } from '../../../animations/gsap'
import { heroFilm, heroFrameAtProgress, heroFramePath } from '../../../data/heroFilm'
import { heroSceneIndexAtProgress } from '../../../data/heroScenes'
import { canLoadFrames, createFrameSequence } from '../../../media/createFrameSequence'

type NetworkInformationLike = { saveData?: boolean }

/** The visitor's data-saver preference. Data-saver gets the poster, not a frame sequence. */
function prefersSaveData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  return connection?.saveData === true
}

/**
 * Scrubs the hero film as the visitor scrolls through the hero (Milestone 3
 * spec §6/§7). Desktop/tablet + no-reduced-motion + no data-saver only: ONE
 * ScrollTrigger pins the hero for a short cinematic run (`heroFilm.scrollPercent`
 * of a viewport of extra scroll, never scroll-jacked — native scroll drives it
 * via `scrub`) and scrubs a single number (0 → 1) that maps linearly to a frame
 * of the hero frame sequence, first frame to last. The frame is painted on the
 * canvas by createFrameSequence and the chapter caption follows the SAME
 * smoothed number, so the caption can never drift from the picture. Scrolling
 * back runs the number back, so the film reverses.
 *
 * Everything on the scroll path is an imperative canvas or DOM write — a frame
 * paint and `data-active` / `data-pos` attributes — so scrolling never causes a
 * React render (docs/CLAUDE.md §21). The headline and calls to action are not
 * touched. Frames are only requested here, after the first render and the GSAP
 * chunk, and only where the film can run; mobile, reduced motion and data-saver
 * keep HeroVisualStage's poster, with no pin, no extra scroll distance and no
 * frame ever fetched.
 */
export function useHeroSceneScrub(sectionRef: RefObject<HTMLElement | null>) {
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

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const canvas = q('[data-hero-canvas]')[0] as HTMLCanvasElement | undefined
        const stage = canvas?.parentElement
        const captions = q('[data-caption]') as HTMLElement[]
        if (!canvas || !stage || prefersSaveData() || !canLoadFrames()) return

        const sequence = createFrameSequence({
          canvas,
          frameCount: heroFilm.frameCount,
          frameUrl: heroFramePath,
          stride: heroFilm.stride,
          cacheSize: heroFilm.cacheSize,
          window: heroFilm.window,
          focalX: heroFilm.focalX,
          // the canvas fades in over the poster, which is the same picture
          onReady: () => {
            stage.dataset.film = 'ready'
          },
        })

        const resizer =
          typeof ResizeObserver === 'function'
            ? new ResizeObserver(() => sequence.resize())
            : undefined
        resizer?.observe(canvas)

        section.dataset.heroFilm = 'on'

        const state = { progress: 0 }
        let lastScene = -1

        const render = (progress: number) => {
          sequence.show(heroFrameAtProgress(progress))

          const active = heroSceneIndexAtProgress(progress)
          if (active === lastScene) return
          lastScene = active
          captions.forEach((caption, i) => {
            caption.dataset.active = String(i === active)
            // Captions already passed leave upward and those still to come wait below,
            // so reversing the scroll reverses the motion.
            caption.dataset.pos = i < active ? 'past' : i === active ? 'current' : 'next'
          })
        }

        render(0)

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${heroFilm.scrollPercent}%`,
              scrub: 0.5,
              pin: true,
            },
          })
          .to(state, {
            progress: 1,
            duration: 1,
            ease: 'none',
            onUpdate: () => render(state.progress),
          })

        return () => {
          resizer?.disconnect()
          sequence.dispose()
          delete section.dataset.heroFilm
          delete stage.dataset.film
          captions.forEach((caption, i) => {
            if (i === 0) caption.dataset.active = 'true'
            else delete caption.dataset.active
            caption.dataset.pos = i === 0 ? 'current' : 'next'
          })
        }
      })
    })

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [sectionRef])
}
