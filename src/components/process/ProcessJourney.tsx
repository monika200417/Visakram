import { useRef } from 'react'
import { toAnchorId } from '../../utils/anchorId'
import type { ProcessStep } from '../../data/process'
import { useProcessJourney } from './useProcessJourney'
import styles from './ProcessJourney.module.css'

type ProcessJourneyProps = {
  steps: readonly ProcessStep[]
}

/**
 * The detailed process journey: one chapter per approved step, in order,
 * along a vertical datum line (docs/DESIGN-SYSTEM.md — architectural, ruled,
 * no cards). Renders exactly what src/data/process.ts holds — index, title
 * and description — plus the position derived from the list ("Stage 02 of
 * 05"). Nothing is invented to fill the space; with no steps it renders
 * nothing at all.
 */
export function ProcessJourney({ steps }: ProcessJourneyProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  useProcessJourney(listRef, progressRef)

  if (steps.length === 0) return null

  const total = String(steps.length).padStart(2, '0')

  return (
    <div className={styles.journey}>
      <span className={styles.track} aria-hidden="true">
        <span ref={progressRef} className={styles.progress} />
      </span>
      <ol ref={listRef} className={styles.stages}>
        {steps.map((step) => (
          <li key={step.title} id={toAnchorId(step.title)} className={styles.stage} data-stage>
            <span className={styles.index} aria-hidden="true">
              {step.index}
            </span>
            <div className={styles.body}>
              <p className={`text-mono-label ${styles.meta}`}>
                Stage {step.index} of {total}
              </p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.description}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
