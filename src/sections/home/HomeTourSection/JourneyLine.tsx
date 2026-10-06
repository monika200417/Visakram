import type { HomeTourSceneChapter } from '../../../media/home-tour/manifest'
import type { HomeTourTimeline } from '../../../media/home-tour/timeline'
import styles from './HomeTourSection.module.css'

/**
 * A fine surveying line along the foot of the frame: a rail, a trace drawn as
 * the tour advances, a station tick at each chapter (spaced by where the film
 * actually reaches it, not evenly), and a marker at the current position.
 * Decorative (aria-hidden); every value is driven by the `--tour-p` CSS
 * variable the scroll hook writes, so it costs nothing per frame in React.
 */
export function JourneyLine({
  chapters,
  timeline,
}: {
  chapters: readonly HomeTourSceneChapter[]
  timeline: HomeTourTimeline
}) {
  return (
    <div className={styles.journey} aria-hidden="true">
      <div className={styles.rail} />
      <div className={styles.trace} />
      <ol className={styles.stations}>
        {chapters.map((chapter, i) => (
          <li
            key={chapter.id}
            className={styles.station}
            style={{ left: `${(timeline.anchors[i] ?? 0) * 100}%` }}
            data-tour-node
            data-active={i === 0}
          >
            <span className={styles.stationNo}>{chapter.index}</span>
          </li>
        ))}
      </ol>
      <div className={styles.marker}>
        <span className={styles.markerRing} />
        <span className={styles.markerDot} />
      </div>
    </div>
  )
}
