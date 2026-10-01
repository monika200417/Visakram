import { lazy, Suspense, useRef, useState } from 'react'
import { Container } from '../../../components/layout/Container'
import { ThreeErrorBoundary } from '../../../three/components/ThreeErrorBoundary'
import { fromPlanToPlaceStages, fromPlanToPlaceDisclaimer } from '../../../data/fromPlanToPlace'
import { useFromPlanToPlaceScrub } from './useFromPlanToPlaceScrub'
import { useSectionVisibility } from './useSectionVisibility'
import { useCanvasEligibility } from './useCanvasEligibility'
import { StaticStagesVisual } from './StaticStagesVisual'
import styles from './FromPlanToPlaceSection.module.css'

/**
 * The dynamic import boundary — this is the only place in the app that
 * ever references src/three/components/PlanToPlaceCanvas, so Vite code-
 * splits Three.js/R3F/drei into their own chunk(s), separate from the
 * initial homepage bundle (Milestone 10 §14).
 */
const PlanToPlaceCanvasLazy = lazy(() => import('../../../three/components/PlanToPlaceCanvas'))

/**
 * Chapter 07 — From Plan to Place
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §07). Sits between
 * The Visakram Way (06) and How We Build (08) on the homepage.
 *
 * The six stages, their titles and descriptions always exist as real
 * HTML — the canvas (or its static fallback) is a visual enhancement
 * layered next to that text, never a replacement for it
 * (docs/SEO-SPEC.md §28, docs/CLAUDE.md §5). The 3D canvas itself is only
 * ever attempted on a desktop viewport, with no reduced-motion
 * preference, once WebGL support is confirmed, and only once the chapter
 * is close to the viewport — every other visit (mobile/tablet, reduced
 * motion, no WebGL, or a runtime failure) renders the same static
 * HTML/CSS fallback instead, and never downloads the 3D chunk at all.
 *
 * Structure (revised — pinned cinematic chapter, §22): the chapter's
 * intro copy (eyebrow/heading/disclaimer) sits in normal document flow
 * at the top of the outer `<section>`, so it scrolls past normally. The
 * `.pinnedViewport` wrapper below it is the actual cinematic composition
 * — capped to ~100svh on desktop and the element GSAP pins (see
 * useFromPlanToPlaceScrub) — so the visual + stage text are always fully
 * on screen together for the whole scrubbed sequence, instead of the
 * previous single oversized pinned `<section>` that could leave part of
 * the composition off-screen. Mobile/reduced motion never pin anything:
 * `.pinnedViewport` is a plain, unstyled wrapper there (see the CSS
 * module), so the chapter lays out as one normal, fully-static, scrolling
 * block exactly as it always has.
 */
export function FromPlanToPlaceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef({ value: 0 })
  const [hasCanvasError, setHasCanvasError] = useState(false)

  const canvasEligible = useCanvasEligibility()
  const { nearViewport, isIntersecting } = useSectionVisibility(sectionRef)

  useFromPlanToPlaceScrub(pinnedRef, progressRef)

  const shouldRenderCanvas = canvasEligible && nearViewport && !hasCanvasError

  return (
    <section
      id="from-plan-to-place"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="from-plan-to-place-heading"
    >
      <Container className={styles.container}>
        <p className={`text-mono-label ${styles.eyebrow}`}>07 — From Plan to Place</p>
        <h2 id="from-plan-to-place-heading" className={styles.heading}>
          From plan to place.
        </h2>
        <p className={styles.disclaimer}>{fromPlanToPlaceDisclaimer}</p>
      </Container>

      <div ref={pinnedRef} className={styles.pinnedViewport}>
        <Container className={styles.pinnedContainer}>
          <div className={styles.stage}>
            <div className={styles.visual}>
              {shouldRenderCanvas ? (
                <ThreeErrorBoundary
                  fallback={<StaticStagesVisual />}
                  onError={() => setHasCanvasError(true)}
                >
                  <Suspense fallback={<StaticStagesVisual />}>
                    <PlanToPlaceCanvasLazy progressRef={progressRef} isVisible={isIntersecting} />
                  </Suspense>
                </ThreeErrorBoundary>
              ) : (
                <StaticStagesVisual />
              )}
            </div>

            <ol className={styles.list} data-stage-list>
              {fromPlanToPlaceStages.map((stage) => (
                <li key={stage.index} className={styles.item} data-stage-item>
                  <span className={`text-mono-label ${styles.itemIndex}`}>{stage.index}</span>
                  <h3 className={styles.itemTitle}>{stage.title}</h3>
                  <p className={styles.itemDescription}>{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </div>
    </section>
  )
}
