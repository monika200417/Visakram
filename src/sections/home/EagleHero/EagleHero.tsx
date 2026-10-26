import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { VisakramWordmark } from '../../../components/brand/wordmark/VisakramWordmark'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { homeTourFilm } from '../../../data/homeTourFilm'
import { site } from '../../../data/site'
import {
  CAMERA_FROM,
  CAMERA_SCALE,
  CLIP_FALLBACK_AT,
  DROP_AT,
  DROP_DUR,
  DIVE_FLIGHT,
  DIVE_SCALE,
  DIVE_TARGET,
  DIVE_WINDOW,
  DROP_STEP,
  EYE_X,
  EYE_Y,
  PULL_AT,
  PULL_DUR,
  REVEAL_AT,
  DIVE_SHARE,
  FADE_VH,
  SCROLL_DIVE,
} from './heroConfig'
import { useHeroCamera, useStageFit } from './useEagleHero'
import { flyToSection } from './flyToSection'
import { useScrollDive } from './useScrollDive'
import styles from './EagleHero.module.css'

/**
 * The homepage hero: an eagle sweeps in, lands on the roof of a Visakram building, the camera pulls
 * back until the whole building and the whole bird are in frame, and VISAKRAM falls in from the top of
 * the screen, one letter after another. The camera then follows the mouse in perspective. The
 * star-tail cursor is the site-wide SiteCursor; over this hero its stars are gold (data-stars).
 *
 * It is one sequence that plays once on load and holds: the flight clip (eagle-flight) dissolves into
 * the still of the city (hero-city), zoomed in tight on the tower's sign, and the still's
 * camera pulls back. The handoff is driven by the clip's own `ended` event so it can never drift from
 * the footage; the timer is only a fallback for when the clip cannot play. Numbers: ./heroConfig.ts.
 *
 * Motion is CSS (transitions and keyframes) plus two requestAnimationFrame loops that write styles
 * directly (useHeroCamera, and the site cursor) — no animation library and no React state per frame. Under
 * prefers-reduced-motion there is no clip, no zoom and no camera: the hero is the finished still with
 * the wordmark drawn and the copy in place (docs/ANIMATION-SYSTEM.md §23).
 *
 * The copy is the page's real, accessible text: one h1, a supporting line from the verified facts in
 * src/data/site.ts, and two links to existing routes. The scene and its layers are decorative.
 */
export function EagleHero() {
  const reducedMotion = usePrefersReducedMotion()
  const outerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLElement>(null)
  const diveRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLAnchorElement>(null)
  const flight = useRef<(() => void) | null>(null)
  const [handoff, setHandoff] = useState(false) // the clip is over
  const [ready, setReady] = useState(false) // the camera has finished pulling back
  const [scrolled, setScrolled] = useState(false) // the scroll dive is away from rest

  const landed = handoff || reducedMotion

  useStageFit(rootRef)
  useHeroCamera(rootRef, handoff && !reducedMotion, scrolled)
  useScrollDive(
    { outer: outerRef, hero: rootRef, stage: stageRef, dive: diveRef, door: windowRef },
    ready && !reducedMotion,
    DIVE_SCALE,
    DIVE_SHARE,
    useCallback((active: boolean) => setScrolled(active), []),
  )

  // The scroll dive wakes once the window has appeared, i.e. when the pull-back is over.
  useEffect(() => {
    if (!handoff || reducedMotion) return
    const t = window.setTimeout(() => setReady(true), (PULL_AT + PULL_DUR) * 1000)
    return () => window.clearTimeout(t)
  }, [handoff, reducedMotion])

  // Leave nothing running if the page is left mid-flight.
  useEffect(() => () => flight.current?.(), [])

  /* The window is a link to the Home Tour, which follows the hero. Clicking it flies the page down to
     the tour, and the scroll-driven zoom plays on the way, so the view goes in through the window and
     arrives in the first room. Without motion (or with a modified click) it is an ordinary jump. */
  function enterWindow(event: MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion || !ready) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return
    const tour = document.querySelector<HTMLElement>(DIVE_TARGET)
    if (!tour) return
    event.preventDefault()
    flight.current?.()
    // land where the hero has finished fading, with the tour fully in view
    flight.current = flyToSection(tour, DIVE_FLIGHT, (window.innerHeight * FADE_VH) / 100)
  }

  // If the clip cannot play (blocked autoplay, no codec, slow network), hand off on a timer.
  useEffect(() => {
    if (reducedMotion || handoff) return
    const t = window.setTimeout(() => setHandoff(true), CLIP_FALLBACK_AT * 1000)
    return () => window.clearTimeout(t)
  }, [reducedMotion, handoff])

  const heroVars = {
    '--from-x': `${CAMERA_FROM.x}px`,
    '--from-y': `${CAMERA_FROM.y}px`,
    '--from-scale': CAMERA_SCALE,
    '--eye': `${EYE_X}px ${EYE_Y}px`,
    '--pull-at': `${PULL_AT}s`,
    '--pull-dur': `${PULL_DUR}s`,
    '--reveal-at': `${REVEAL_AT}s`,
    '--dive-scroll': SCROLL_DIVE,
  } as CSSProperties

  return (
    <div
      ref={outerRef}
      className={styles.outer}
      style={heroVars}
      data-still={reducedMotion ? 'true' : undefined}
    >
      <section
        ref={rootRef}
        className={styles.hero}
        data-hero
        data-phase={landed ? 'landed' : 'flight'}
        data-stars="gold"
        data-still={reducedMotion ? 'true' : undefined}
        aria-label="Visakram Builders"
      >
        <div ref={stageRef} className={styles.stage}>
          {/* The dive: the whole scene zooms through the window (see enterWindow). */}
          <div ref={diveRef} className={styles.dive}>
            {/* The camera: everything in the scene tilts together, in perspective. */}
            <div className={styles.camera} data-cam="scene">
              {/* The finished frame: the building with the eagle on its roof. It arrives tight on the bird
              and a little out of focus, and the camera backs away until the whole scene is in frame. */}
              <div className={styles.pull}>
                <img
                  src="/assets/eagle-hero/hero-city.webp"
                  alt="A white residential tower with the Visakram Builders sign, above a coastal city at sunrise"
                  className={styles.still}
                  width={1678}
                  height={937}
                  decoding="async"
                  fetchPriority="high"
                />

                {/* The way in: an unmarked link over a window on the big tower at the right. It rides on the still, so it stays
                on the building through the pull-back and the tilt, and goes live once the camera has settled. */}
                <a
                  ref={windowRef}
                  href={DIVE_TARGET}
                  className={styles.door}
                  style={{ left: DIVE_WINDOW.x, top: DIVE_WINDOW.y }}
                  onClick={enterWindow}
                  aria-label="Step inside: take the home tour"
                  tabIndex={landed ? 0 : -1}
                />
              </div>

              {/* The flight clip on its mist ground, over the building until the handoff, then gone. */}
              {!reducedMotion ? (
                <div className={styles.clip} aria-hidden="true">
                  <img
                    src="/assets/eagle-hero/eagle-ground.webp"
                    alt=""
                    className={styles.clipMedia}
                    decoding="async"
                  />
                  <video
                    className={styles.clipMedia}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => setHandoff(true)}
                    onError={() => setHandoff(true)}
                  >
                    <source src="/assets/eagle-hero/eagle-flight.webm" type="video/webm" />
                    <source src="/assets/eagle-hero/eagle-flight.mp4" type="video/mp4" />
                  </video>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* The end of the zoom: the picture dissolves into the Home Tour's own first frame, which the tour
          (pulled up beneath the hero) is already showing. */}
        <img
          src={homeTourFilm.poster}
          alt=""
          className={styles.finale}
          data-dive-finale
          aria-hidden="true"
          decoding="async"
        />

        {/* The page content floats a little against the camera, the other way, so it seems to sit in
          front of the scene. */}
        <div className={styles.ui} data-cam="ui">
          <div className={styles.copy}>
            {/* Solid Lac Red with the skyline cut out of it; the letters fall in from the top of the
              screen once the clip has ended and the camera starts pulling back. The word is already
              in the page text, so the drawing is hidden from assistive tech. */}
            <div className={styles.wordmark}>
              <VisakramWordmark
                title=""
                drop={reducedMotion ? undefined : handoff}
                dropDelay={DROP_AT}
                dropStep={DROP_STEP}
                dropDuration={DROP_DUR}
              />
            </div>

            <p className={`${styles.eyebrow} ${styles.reveal}`} style={{ ['--d' as string]: '0s' }}>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              {site.city} · Built on high ground
            </p>

            <h1 className={styles.headline}>
              <span
                className={`${styles.line} ${styles.reveal}`}
                style={{ ['--d' as string]: '0.05s' }}
              >
                <span className={styles.white}>Different</span>{' '}
                <span className={styles.accent}>Spaces.</span>
              </span>{' '}
              <span
                className={`${styles.line} ${styles.reveal}`}
                style={{ ['--d' as string]: '0.12s' }}
              >
                <span className={styles.accent}>One</span>{' '}
                <span className={styles.white}>Vision.</span>
              </span>
            </h1>

            <p
              className={`${styles.supporting} ${styles.reveal}`}
              style={{ ['--d' as string]: '0.2s' }}
            >
              Developing the Future of Living, Working &amp; Connecting.
            </p>

            <div
              className={`${styles.actions} ${styles.reveal}`}
              style={{ ['--d' as string]: '0.28s' }}
            >
              {/* The arrow jumps over the label on hover: a circle in the slot either side of it, one
                shrinking away as the other grows. Both slots are always in the row so nothing beside
                the button moves. */}
              <Link to="/projects" className={styles.arrowBtn}>
                <ArrowSlot lead />
                <span className={styles.arrowLabel}>See what we&rsquo;re building</span>
                <ArrowSlot />
              </Link>
              <Link to="/contact" className={styles.textLink}>
                Start a Project
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 10L10 2M10 2H4M10 2v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ArrowSlot({ lead = false }: { lead?: boolean }) {
  return (
    <span
      className={`${styles.arrowSlot}${lead ? ` ${styles.arrowSlotLead}` : ''}`}
      aria-hidden="true"
    >
      <span className={styles.arrowDot}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  )
}
