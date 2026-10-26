import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import {
  fromPlanToPlaceCaption,
  fromPlanToPlaceDisclaimer,
  fromPlanToPlaceStages,
} from '../../../data/fromPlanToPlace'
import { PlanToPlaceVideo } from './PlanToPlaceVideo'
import { useFromPlanToPlaceScrub } from './useFromPlanToPlaceScrub'
import { useSectionVisibility } from './useSectionVisibility'
import styles from './FromPlanToPlaceSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * Chapter 07 — From Scratch to Shape (id and file names keep the original "from plan to place")
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §07). Sits between
 * The Visakram Way (06) and How We Build (08) on the homepage.
 *
 * A two-column editorial composition: on the left the chapter's title and caption and
 * the six methodology stages as a quiet timeline; on the right the supplied
 * walkthrough video, which autoplays on its own and is the visual anchor
 * (PlanToPlaceVideo). The six stages, their titles and descriptions are always real
 * HTML. On desktop with motion allowed the whole composition is pinned for a short
 * scroll and useFromPlanToPlaceScrub moves the emphasis down the stages as the visitor
 * scrolls — independently of the video, which simply keeps playing. Everywhere else
 * (tablet, mobile, reduced motion) nothing is pinned and every stage is shown in full,
 * as one normal, scrolling block.
 */
export function FromPlanToPlaceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)

  const { nearViewport, isIntersecting } = useSectionVisibility(sectionRef)

  useFromPlanToPlaceScrub(pinnedRef)

  return (
    <section
      id="from-plan-to-place"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="from-plan-to-place-heading"
    >
      <div ref={pinnedRef} className={styles.pinnedViewport}>
        <Container className={styles.pinnedContainer}>
          <div className={styles.stage}>
            <div className={styles.copy}>
              <div className={styles.intro}>
                <Heading as="h2" id="from-plan-to-place-heading" className={styles.heading}>
                  Turning Land into Legacy.
                </Heading>
                <p className={styles.caption}>{fromPlanToPlaceCaption}</p>
              </div>

              <ol className={styles.list} data-stage-list>
                {fromPlanToPlaceStages.map((stage) => (
                  <li key={stage.index} className={styles.item} data-stage-item>
                    <span className={`text-mono-label ${styles.itemIndex}`}>{stage.index}</span>
                    <h3 className={styles.itemTitle}>{stage.title}</h3>
                    <div className={styles.itemBody}>
                      <p className={styles.itemDescription}>{stage.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <figure className={styles.visual}>
              <PlanToPlaceVideo near={nearViewport} visible={isIntersecting} />
              <figcaption className={styles.disclaimer}>{fromPlanToPlaceDisclaimer}</figcaption>
            </figure>
          </div>
        </Container>
      </div>
    </section>
  )
}
