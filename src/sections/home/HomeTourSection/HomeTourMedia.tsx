import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { HomeTourSceneChapter } from '../../../media/home-tour/manifest'
import { createSeeker, loadWindow } from '../../../media/home-tour/seek'
import type { HomeTourTimeline } from '../../../media/home-tour/timeline'
import styles from './HomeTourSection.module.css'

type Seeker = ReturnType<typeof createSeeker>

export type HomeTourMediaProps = {
  chapters: readonly HomeTourSceneChapter[]
  timeline: HomeTourTimeline
  /** The shared normalized progress (0–1) — read once, to start in the right place. */
  progressRef: RefObject<{ value: number }>
  /**
   * Hands the scroll hook this component's frame driver (and `null` on unmount).
   * The hook calls it with the normalized progress on every scrub tick; it writes
   * straight to the DOM, so no React state changes while scrolling.
   */
  onReady: (render: ((progress: number) => void) | null) => void
}

type Failure = 'video' | 'poster'

/**
 * The film behind the Home Tour: one still + one muted clip per chapter, stacked
 * full-bleed. Scrolling never plays anything — the scroll hook asks for a
 * progress value and this component sets each visible clip's `currentTime` and
 * each figure's opacity directly (see timeline.ts for the mapping).
 *
 *  - The still is always there beneath its clip, so there is never a blank frame
 *    while a clip loads, seeks, or fails.
 *  - Only the active chapter, the next and the previous keep media mounted;
 *    farther clips are released.
 *  - A clip that errors falls back to its still; a still that errors falls back
 *    to a quiet tinted panel. The section never goes blank.
 *
 * It is decorative (aria-hidden): the chapters are real HTML in the overlay.
 */
export function HomeTourMedia({ chapters, timeline, progressRef, onReady }: HomeTourMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const figures = useRef<Array<HTMLElement | null>>([])
  const seekers = useRef(new Map<number, Seeker>())
  const lastProgress = useRef(0)
  const activeRef = useRef(0)

  const [active, setActive] = useState(0)
  const [failures, setFailures] = useState<Record<string, Failure>>({})

  /** The frame driver: progress → active chapter, figure opacity, clip times. */
  const render = useCallback(
    (progress: number) => {
      lastProgress.current = progress
      const frame = timeline.frameAt(progress)
      if (frame.active !== activeRef.current) {
        // Rare (once per chapter boundary): moves the load window.
        activeRef.current = frame.active
        setActive(frame.active)
      }
      chapters.forEach((_, i) => {
        const figure = figures.current[i]
        if (!figure) return
        const layer = frame.layers.find((l) => l.index === i)
        figure.style.opacity = layer ? String(layer.opacity) : '0'
        figure.style.visibility = layer ? 'visible' : 'hidden'
        if (layer) seekers.current.get(i)?.seek(layer.time)
      })
      const root = rootRef.current
      const top = frame.layers[frame.layers.length - 1]
      if (root && top) {
        root.dataset.active = chapters[frame.active]?.id ?? ''
        root.dataset.clipTime = top.time.toFixed(3)
      }
    },
    [chapters, timeline],
  )

  // Register the driver and draw the current frame (starting wherever the shared progress is)
  useEffect(() => {
    onReady(render)
    render(progressRef.current.value)
    return () => onReady(null)
  }, [render, onReady, progressRef])

  // A chapter's media (re)mounting needs the right opacity and clip time at once
  useEffect(() => {
    render(lastProgress.current)
  }, [active, failures, render])

  const registerVideo = (index: number, node: HTMLVideoElement | null) => {
    seekers.current.get(index)?.dispose()
    seekers.current.delete(index)
    if (!node) return
    node.muted = true
    seekers.current.set(index, createSeeker(node))
  }

  const fail = (id: string, kind: Failure) =>
    setFailures((previous) => (previous[id] ? previous : { ...previous, [id]: kind }))

  const mounted = loadWindow(active, chapters.length)

  return (
    <div ref={rootRef} className={styles.media} aria-hidden="true" data-home-tour-media>
      {mounted.map((i) => {
        const chapter = chapters[i]!
        const failure = failures[chapter.id]
        return (
          <div
            key={chapter.id}
            ref={(node) => {
              figures.current[i] = node
            }}
            className={styles.figure}
            data-chapter={chapter.id}
          >
            {failure === 'poster' ? (
              <div className={styles.fallback} data-fallback="true" />
            ) : (
              <img
                className={styles.still}
                src={chapter.poster}
                alt=""
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                onError={() => fail(chapter.id, 'poster')}
              />
            )}
            {failure === 'video' ? null : (
              <video
                ref={(node) => registerVideo(i, node)}
                className={styles.video}
                src={chapter.video}
                muted
                playsInline
                disablePictureInPicture
                tabIndex={-1}
                preload={i === active || i === active + 1 ? 'auto' : 'metadata'}
                onLoadedData={(event) => {
                  event.currentTarget.dataset.ready = 'true'
                }}
                onError={() => fail(chapter.id, 'video')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
