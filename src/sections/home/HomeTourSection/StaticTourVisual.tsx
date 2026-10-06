import { homeTourDisclaimer } from '../../../data/homeTour'
import type { HomeTourSceneChapter } from '../../../media/home-tour/manifest'
import { HomeTourIntro } from './HomeTourOverlay'
import styles from './HomeTourSection.module.css'

/**
 * The Home Tour without the film — shown on mobile and tablet, with reduced
 * motion, with a data-saver request, or if the media fails to render. One calm
 * block: the title, then a card per chapter (its still, number, title and
 * caption). No video is requested, nothing is pinned and nothing animates.
 * Stills load lazily below the fold.
 */
export function StaticTourVisual({ chapters }: { chapters: readonly HomeTourSceneChapter[] }) {
  return (
    <div className={styles.staticBlock}>
      <HomeTourIntro />
      <ol className={styles.cards}>
        {chapters.map((chapter) => (
          <li key={chapter.id} className={styles.card}>
            <img
              className={styles.cardImage}
              src={chapter.poster}
              alt=""
              width={1376}
              height={768}
              loading="lazy"
              decoding="async"
            />
            <span className={`text-mono-label ${styles.chapterIndex}`}>{chapter.index} —</span>
            <h3 className={styles.chapterTitle}>{chapter.title}</h3>
            <p className={styles.chapterCaption}>{chapter.caption}</p>
          </li>
        ))}
      </ol>
      <p className={styles.disclaimer}>{homeTourDisclaimer}</p>
    </div>
  )
}
