import { useRef } from 'react'
import { DevImagePlaceholder } from '../media/DevImagePlaceholder'
import { useRevealOnScroll } from '../../animations/useRevealOnScroll'
import { founderBackgroundDisclaimer, type Founder } from '../../data/founders'
import styles from './FounderProfile.module.css'

type FounderProfileProps = {
  founder: Founder
  /** Alternates the media/text side on desktop, mirroring the editorial
   *  row pattern used elsewhere (BuildCategoryRow, ProjectCard). */
  align?: 'start' | 'end'
}

/**
 * Reusable founder presentation (Milestone 7 — "TWO BACKGROUNDS. ONE
 * DIRECTION.", docs/DESIGN-SYSTEM.md §12). Deliberately not a profile
 * card: a large editorial media area plus name, positioning and verified
 * background, rendered entirely from src/data/founders.ts — no founder
 * fact is hardcoded here.
 *
 * Renders founderBackgroundDisclaimer right under the background list
 * whenever that list is shown, so no consumer of this component can ever
 * omit it by accident (see the disclaimer's own doc comment). Styled
 * small and muted — present, never dominant.
 */
export function FounderProfile({ founder, align = 'start' }: FounderProfileProps) {
  const revealRef = useRef<HTMLElement>(null)
  useRevealOnScroll(revealRef, { y: 28 })

  const hasBackground = founder.background.length > 0
  const hasEducation = Boolean(founder.education && founder.education.length > 0)

  return (
    <article ref={revealRef} className={styles.profile} data-align={align}>
      <div className={styles.media}>
        {founder.image ? (
          <img
            src={founder.image}
            alt={`${founder.name} portrait`}
            className={styles.photo}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <DevImagePlaceholder label={founder.name} />
        )}
      </div>

      <div className={styles.text}>
        <h3 className={styles.name}>{founder.name}</h3>
        <p className={`text-mono-label ${styles.positioning}`}>
          {founder.positioning}
          {founder.age ? ` · Age ${founder.age}` : ''}
        </p>

        {hasBackground ? (
          <div className={styles.group}>
            <span className={`text-mono-label ${styles.groupLabel}`}>Professional background</span>
            <ul className={styles.list}>
              {founder.background.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className={styles.disclaimer}>{founderBackgroundDisclaimer}</p>
          </div>
        ) : null}

        {hasEducation ? (
          <div className={styles.group}>
            <span className={`text-mono-label ${styles.groupLabel}`}>Education</span>
            <ul className={styles.list}>
              {founder.education!.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {founder.exposure ? (
          <div className={styles.group}>
            <span className={`text-mono-label ${styles.groupLabel}`}>Geographic exposure</span>
            <p className={styles.exposure}>{founder.exposure}</p>
          </div>
        ) : null}

        {founder.quote ? (
          <blockquote className={styles.quote}>&ldquo;{founder.quote}&rdquo;</blockquote>
        ) : null}
      </div>
    </article>
  )
}
