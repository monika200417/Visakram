import { useLayoutEffect, type RefObject } from 'react'
import { loadGsap } from '../../../animations/gsap'
import {
  chapterIndexAtTime,
  filmProgressAtTime,
  filmTimeAtProgress,
  homeTourFilmScrollPercent,
} from '../../../data/homeTourFilm'
import { createFrameSeeker } from './createFrameSeeker'

/**
 * Drives the Home Tour film from the page scroll. ONE ScrollTrigger pins the
 * stage and scrubs a single number (0 → 1) over the pinned distance; that
 * number maps linearly to a time in the video (0 → its full duration), the
 * frame at that time is requested from the video, and the chapter overlay
 * follows the SAME smoothed number, so the text can never drift
 * from the frame that is showing. Scrolling back simply runs the number back.
 *
 * Everything on the scroll path is an imperative DOM write — a `seeked`-gated
 * `currentTime` and `data-active` / `data-pos` / `aria-hidden` attributes —
 * so scrolling never causes a React render (docs/CLAUDE.md §21). The video is
 * never played.
 *
 * `enabled` is false for reduced motion and data-saver: the hook then does
 * nothing at all and the section stays a still frame with its chapter list.
 */
/** Scroll progress (0–1) past which the introduction laid over the film's opening fades away. */
const INTRO_PROGRESS = 0.035

export function useFilmScrub(
  pinnedRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    const pinned = pinnedRef.current
    const video = videoRef.current
    if (!enabled || !pinned || !video || typeof window === 'undefined') return

    let cancelled = false
    let cleanup: (() => void) | undefined

    loadGsap().then(({ gsap }) => {
      if (cancelled || !pinned.isConnected) return

      const chapters = Array.from(pinned.querySelectorAll<HTMLElement>('[data-chapter]'))
      const seeker = createFrameSeeker(video)
      const state = { progress: 0 }
      let lastChapter = -1
      let lastPast = false

      const render = (progress: number) => {
        seeker.seek(filmTimeAtProgress(progress))

        // The section's introduction, laid over the first frames, gives way once the film has begun.
        const past = progress > INTRO_PROGRESS
        if (past !== lastPast) {
          lastPast = past
          pinned.dataset.past = String(past)
        }

        const active = chapterIndexAtTime(filmTimeAtProgress(progress))
        if (active === lastChapter) return
        lastChapter = active
        chapters.forEach((chapter, i) => {
          chapter.dataset.active = String(i === active)
          // Chapters already passed leave upward and those still to come wait below,
          // so reversing the scroll reverses the motion.
          chapter.dataset.pos = i < active ? 'past' : i === active ? 'current' : 'next'
          chapter.setAttribute('aria-hidden', String(i !== active))
        })
      }

      render(filmProgressAtTime(0))

      const context = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: pinned,
              start: 'top top',
              end: `+=${homeTourFilmScrollPercent}%`,
              // A long, soft follow: wheel notches and trackpad flicks arrive as jumps in scroll
              // position, and this glides the film through them so the camera never seems to stop
              // and start with each one.
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // This pin now follows the hero directly, and the Visakram Way and From Plan to
              // Place pins sit below it, so their starts depend on the scroll space this one adds.
              // A positive priority sorts it before every default-priority trigger on each refresh,
              // so it is always measured first and everything under it is measured against it.
              refreshPriority: 1,
              // Chapter text only shows once the stage has filled the viewport (and stays
              // after the pin releases), so chapter 01 rises in on arrival.
              onToggle: (self) => {
                pinned.dataset.live = String(self.isActive || self.progress >= 1)
              },
            },
          })
          .to(state, {
            progress: 1,
            duration: 1,
            ease: 'none',
            onUpdate: () => render(state.progress),
          })
      }, pinned)

      cleanup = () => {
        context.revert()
        seeker.dispose()
        delete pinned.dataset.live
        delete pinned.dataset.past
        chapters.forEach((chapter) => {
          delete chapter.dataset.active
          delete chapter.dataset.pos
          chapter.removeAttribute('aria-hidden')
        })
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [pinnedRef, videoRef, enabled])
}
