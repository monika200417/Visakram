import { useEffect, useRef, useState } from 'react'
import { homeSegments } from '../../../data/homeSegments'
import { Container } from '../../../components/layout/Container'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { BuildCategoryCard } from './BuildCategoryCard'
import { FeaturedProjectCard } from './FeaturedProjectCard'
import styles from './WhatWeBuildSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * How many copies of the set sit in the moving track. The track drifts by exactly one set's width and
 * then starts again, so a set must be wider than what is left of the screen: four copies cover any
 * window up to a very wide one.
 */
const COPIES = 4

/** How long a press of the previous / next button takes to carry the cards one card along. */
const NUDGE_MS = 650

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Chapter 04 — What We Build
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §05). The four segment cards (Residential,
 * Commercial, Mixed-use, Hospitality), then a fourth card
 * for the featured project, drift across the page from left to right in an endless loop and stop while
 * they are hovered or focused. Three controls sit beside the heading: previous and next carry the
 * cards one card along, and pause / play holds the drift for good. Content comes from
 * src/data/homeSegments.ts. Only the first set is real: the copies that make the loop seamless are hidden
 * from assistive tech and cannot be tabbed to. Under reduced motion nothing drifts; the cards sit in
 * one row that scrolls sideways, previous and next scroll it, and there is no pause button.
 */
export function WhatWeBuildSection() {
  const reducedMotion = usePrefersReducedMotion()
  const carouselRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const nudge = useRef<number>(0) // the running nudge's animation frame, if any
  const [paused, setPaused] = useState(false)

  // Leave nothing running if the page is left mid-nudge.
  useEffect(() => () => cancelAnimationFrame(nudge.current), [])

  /** Carry the cards one card along: direction +1 moves them rightward (earlier cards come in from the left). */
  function step(direction: 1 | -1) {
    const carousel = carouselRef.current
    const track = trackRef.current
    const first = track?.querySelector<HTMLElement>('ul > li')
    if (!carousel || !track || !first) return
    const gap = parseFloat(getComputedStyle(first.parentElement as HTMLElement).columnGap) || 0
    const cardStep = first.offsetWidth + gap

    if (reducedMotion) {
      carousel.scrollBy({ left: -direction * cardStep, behavior: 'auto' })
      return
    }

    const animation = track.getAnimations?.()[0]
    const timing = animation?.effect?.getComputedTiming()
    const setWidth = (first.parentElement as HTMLElement).offsetWidth
    const duration = typeof timing?.duration === 'number' ? timing.duration : 0
    if (!animation || !duration || !setWidth) return

    // one card is this much of the loop's time
    const delta = direction * (cardStep / setWidth) * duration
    cancelAnimationFrame(nudge.current)
    const from = Number(animation.currentTime ?? 0)
    const startedAt = performance.now()
    const drifting = getComputedStyle(track).animationPlayState === 'running'
    const at = (ms: number) => ((ms % duration) + duration) % duration

    const frame = (now: number) => {
      const p = Math.min(1, (now - startedAt) / NUDGE_MS)
      // the drift carries on underneath the nudge while it is running
      const natural = drifting ? now - startedAt : 0
      animation.currentTime = at(from + natural + delta * easeOutCubic(p))
      if (p < 1) nudge.current = requestAnimationFrame(frame)
    }
    nudge.current = requestAnimationFrame(frame)
  }

  return (
    <section id="what-we-build" className={styles.section} aria-labelledby="what-we-build-heading">
      <Container>
        <div className={styles.head}>
          <Heading as="h2" id="what-we-build-heading" className={styles.heading}>
            What we build.
          </Heading>

          <div className={styles.controls} role="group" aria-label="Carousel controls">
            <button
              type="button"
              className={styles.button}
              aria-label="Previous card"
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5 8 12l7 7" />
              </svg>
            </button>
            {reducedMotion ? null : (
              <button
                type="button"
                className={styles.button}
                aria-label={paused ? 'Play carousel' : 'Pause carousel'}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {paused ? (
                    <path className={styles.solid} d="M8 5.5v13l11-6.5-11-6.5Z" />
                  ) : (
                    <>
                      <path className={styles.solid} d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                    </>
                  )}
                </svg>
              </button>
            )}
            <button
              type="button"
              className={styles.button}
              aria-label="Next card"
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div ref={carouselRef} className={styles.carousel} data-paused={paused ? 'true' : undefined}>
        <div ref={trackRef} className={styles.track}>
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              className={styles.set}
              aria-hidden={copy > 0 ? true : undefined}
              inert={copy > 0}
              data-copy={copy > 0 ? 'true' : undefined}
            >
              {homeSegments.map((segment) => (
                <BuildCategoryCard key={segment.slug} segment={segment} />
              ))}
              <FeaturedProjectCard />
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
