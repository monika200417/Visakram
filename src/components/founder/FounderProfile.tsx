import { useRef } from 'react'
import { DevImagePlaceholder } from '../media/DevImagePlaceholder'
import { NoBreak } from '../text/NoBreak'
import { useRevealOnScroll } from '../../animations/useRevealOnScroll'
import { site } from '../../data/site'
import type { Founder } from '../../data/founders'
import styles from './FounderProfile.module.css'

type FounderProfileProps = {
  founder: Founder
  /** Alternates the media/text side on desktop, mirroring the editorial
   *  row pattern used elsewhere (BuildCategoryCard, ProjectCard). */
  align?: 'start' | 'end'
}

/** Sets the region's name unbroken wherever the founders' own words contain it. */
function withRegionKept(paragraph: string) {
  const at = paragraph.indexOf(site.region)
  if (at === -1) return paragraph
  return (
    <>
      {paragraph.slice(0, at)}
      <NoBreak>{site.region}</NoBreak>
      {paragraph.slice(at + site.region.length)}
    </>
  )
}

/**
 * Reusable founder presentation (Milestone 7 — "TWO BACKGROUNDS. ONE
 * DIRECTION.", docs/DESIGN-SYSTEM.md §12). Deliberately not a profile
 * card: a large editorial media area plus the founder's own story — label,
 * headline, paragraphs, closing line and signature — and their education,
 * rendered entirely from src/data/founders.ts; no founder fact is hardcoded here.
 */
export function FounderProfile({ founder, align = 'start' }: FounderProfileProps) {
  const revealRef = useRef<HTMLElement>(null)
  useRevealOnScroll(revealRef, { y: 28 })

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
        <p className={`text-mono-label ${styles.storyLabel}`}>{founder.storyLabel}</p>
        <h3 className={styles.headline}>{founder.headline}</h3>
        <p className={styles.subheading}>{founder.subheading}</p>

        <div className={styles.story}>
          {founder.story.map((paragraph) => (
            <p key={paragraph}>{withRegionKept(paragraph)}</p>
          ))}
        </div>

        <p className={styles.closing}>{founder.closing}</p>

        <p className={styles.signature}>
          <span className={styles.name}>{founder.name}</span>
          <span className={styles.role}>{founder.role}</span>
          <span className={styles.company}>{site.name}</span>
        </p>

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
      </div>
    </article>
  )
}
