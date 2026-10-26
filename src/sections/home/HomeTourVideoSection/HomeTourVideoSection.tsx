import { useRef } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import {
  homeTourFilm,
  homeTourFilmChapters,
  homeTourFilmDisclaimer,
  homeTourFilmHeading,
  homeTourFilmTagline,
} from '../../../data/homeTourFilm'
import { homeTourChapterCopy } from './chapterCopy'
import { useFilmScrub } from './useFilmScrub'
import { useIntroEntrance } from './useIntroEntrance'
import { useNearViewport, useFilmSource, useIsPhone, useSaveData } from './useFilmMedia'
import styles from './HomeTourVideoSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/** How many twinkling stars lie over the film (see useFilmScrub for where and when; hidden in still mode). */
const FILM_STAR_COUNT = 14

/**
 * Chapter 07B — Home Tour (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md).
 * A pinned, full-screen cinematic section whose single film — one real
 * walkthrough video — is scrubbed by the page scroll: scroll down and the camera
 * moves through the house, scroll up and it moves back out. The chapter title,
 * a short line and a gold baseline float over the footage. One ScrollTrigger (useFilmScrub)
 * maps the scroll to a time in the video and to the active chapter.
 *
 * The chapter list is always real HTML text. With reduced motion or data-saver
 * nothing is pinned and no film is downloaded: the video's first frame (its
 * poster) is shown with the same list laid out in full. The DOM is the same in
 * both modes — only `data-mode`, the video `src` and the scrub differ — so a
 * mode change never rebuilds the tree a pin is attached to.
 */
export function HomeTourVideoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  const reducedMotion = usePrefersReducedMotion()
  const saveData = useSaveData()
  const phone = useIsPhone()
  const scrubbing = !reducedMotion && !saveData

  // The film is only fetched when the section is near the viewport, and released when it is not.
  const near = useNearViewport(sectionRef)
  const filmWanted = scrubbing && near
  useFilmSource(videoRef, filmWanted)

  useFilmScrub(pinnedRef, videoRef, scrubbing)
  useIntroEntrance(introRef)

  return (
    <section
      id="home-tour"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="home-tour-heading"
      data-mode={scrubbing ? 'film' : 'still'}
    >
      <div ref={pinnedRef} className={styles.pinned}>
        <div className={styles.stage}>
          <div className={styles.frame} role="img" aria-label={homeTourFilm.alt}>
            <video
              ref={videoRef}
              className={styles.video}
              src={filmWanted ? (phone ? homeTourFilm.srcMobile : homeTourFilm.src) : undefined}
              poster={homeTourFilm.poster}
              width={homeTourFilm.width}
              height={homeTourFilm.height}
              muted
              playsInline
              // The phone film is small enough to take whole, so a swipe never waits on a range request; the
              // desktop film is 34 MB and is fetched only as the scrub reaches it.
              preload={phone ? 'auto' : 'none'}
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          </div>

          {/* Twinkling stars at random places, shown only while the film is being scrolled (useFilmScrub moves them). */}
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: FILM_STAR_COUNT }, (_, i) => (
              <span key={i} className={styles.star} data-star />
            ))}
          </div>

          <div className={styles.introLayer}>
            <div ref={introRef} className={styles.intro}>
              <Heading as="h2" id="home-tour-heading" className={styles.heading}>
                {homeTourFilmHeading}.
              </Heading>
              <p className={styles.tagline}>{homeTourFilmTagline}</p>
              <p className={styles.disclaimer}>{homeTourFilmDisclaimer}</p>
            </div>
          </div>

          <div className={styles.overlay}>
            <ol className={styles.chapters} data-chapter-list>
              {homeTourFilmChapters.map((chapter, i) => (
                <li
                  key={chapter.id}
                  className={styles.chapter}
                  data-chapter
                  data-solo={chapter.solo ? 'true' : undefined}
                  data-active={scrubbing && i === 0 ? 'true' : undefined}
                  data-pos={scrubbing ? (i === 0 ? 'current' : 'next') : undefined}
                  aria-hidden={scrubbing && i !== 0 ? 'true' : undefined}
                >
                  {chapter.solo ? null : (
                    <span className={`text-mono-label ${styles.index}`}>
                      <span className={styles.reveal}>{chapter.index}</span>
                    </span>
                  )}
                  <span className={styles.title}>
                    <span className={styles.reveal}>
                      {chapter.accent && chapter.title.startsWith(chapter.accent) ? (
                        <>
                          <span className={styles.titleLead}>{chapter.accent}</span>{' '}
                          <span className={styles.titleRest}>
                            {chapter.title.slice(chapter.accent.length).trim()}
                          </span>
                        </>
                      ) : (
                        chapter.title
                      )}
                    </span>
                  </span>
                  {chapter.solo ? null : (
                    <>
                      <span className={styles.support}>{homeTourChapterCopy[chapter.id]}</span>
                      <span className={styles.baseline} aria-hidden="true" />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
