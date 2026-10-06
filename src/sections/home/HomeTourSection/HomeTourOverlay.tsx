import { homeTourHeading, homeTourTagline } from '../../../data/homeTour'
import type { HomeTourSceneChapter } from '../../../media/home-tour/manifest'
import styles from './HomeTourSection.module.css'

/** The section's opening title. Shared by the pinned tour and the static block. */
export function HomeTourIntro() {
  return (
    <div className={styles.intro}>
      <h2 id="home-tour-heading" className={styles.heading}>
        {homeTourHeading}
      </h2>
      <p className={styles.tagline}>{homeTourTagline}</p>
    </div>
  )
}

/**
 * The quiet editorial layer over the film: one chapter caption at a time
 * ("01 — Exterior …"), switched by the scroll hook through `data-active`. All
 * chapters are real HTML, and the villa remains the primary visual.
 */
export function HomeTourOverlay({ chapters }: { chapters: readonly HomeTourSceneChapter[] }) {
  return (
    <ol className={styles.chapters} data-tour-chapters>
      {chapters.map((chapter) => (
        <li key={chapter.id} className={styles.chapter} data-tour-chapter>
          <span className={`text-mono-label ${styles.chapterIndex}`}>{chapter.index} —</span>
          <h3 className={styles.chapterTitle}>{chapter.title}</h3>
          <p className={styles.chapterCaption}>{chapter.caption}</p>
        </li>
      ))}
    </ol>
  )
}
