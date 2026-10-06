import { useCallback, useRef, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { homeTourDisclaimer } from '../../../data/homeTour'
import { homeTourSequence } from '../../../media/home-tour/manifest'
import { homeTourTimeline } from '../../../media/home-tour/timeline'
import { HomeTourMedia } from './HomeTourMedia'
import { HomeTourIntro, HomeTourOverlay } from './HomeTourOverlay'
import { JourneyLine } from './JourneyLine'
import { MediaErrorBoundary } from './MediaErrorBoundary'
import { StaticTourVisual } from './StaticTourVisual'
import { useHomeTourScrub } from './useHomeTourScrub'
import { useMediaTourEligibility } from './useMediaTourEligibility'
import { useProximity } from './useProximity'
import styles from './HomeTourSection.module.css'

/**
 * Home Tour — a premium property tour driven by photorealistic footage. On a
 * desktop with motion allowed, a pinned 100svh frame holds the film; scrolling
 * moves it (ONE ScrollTrigger → ONE progress value → chapter timeline → clip
 * `currentTime`), and scrolling back reverses it. Every other visit — mobile,
 * tablet, reduced motion, data-saver, or a runtime failure — gets the same
 * chapters as a calm static block of stills. Which clips exist, and how long
 * each takes to scroll through, is data (src/media/home-tour/manifest.ts); the
 * chapters are always real HTML.
 */
export function HomeTourSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef({ value: 0 })
  const renderRef = useRef<((progress: number) => void) | null>(null)
  const [hasError, setHasError] = useState(false)

  const eligible = useMediaTourEligibility()
  const tourActive = eligible && !hasError
  const { isNear } = useProximity(sectionRef)

  useHomeTourScrub(pinnedRef, progressRef, renderRef, tourActive)

  const handleReady = useCallback((render: ((progress: number) => void) | null) => {
    renderRef.current = render
  }, [])

  return (
    <section
      id="home-tour"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="home-tour-heading"
      data-mode={tourActive ? 'tour' : 'static'}
    >
      {tourActive ? (
        <div ref={pinnedRef} className={styles.pinned}>
          <div className={styles.stage}>
            {isNear ? (
              <MediaErrorBoundary onError={() => setHasError(true)}>
                <HomeTourMedia
                  chapters={homeTourSequence}
                  timeline={homeTourTimeline}
                  progressRef={progressRef}
                  onReady={handleReady}
                />
              </MediaErrorBoundary>
            ) : null}
          </div>
          <div className={styles.vignette} aria-hidden="true" />

          <Container className={styles.container}>
            <HomeTourIntro />
            <HomeTourOverlay chapters={homeTourSequence} />
            <p className={styles.disclaimer}>{homeTourDisclaimer}</p>
          </Container>

          <JourneyLine chapters={homeTourSequence} timeline={homeTourTimeline} />
        </div>
      ) : (
        <Container>
          <StaticTourVisual chapters={homeTourSequence} />
        </Container>
      )}
    </section>
  )
}
