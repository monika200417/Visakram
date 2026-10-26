import { useEffect, useRef } from 'react'
import { fromPlanToPlaceVideo } from '../../../data/fromPlanToPlace'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import styles from './FromPlanToPlaceSection.module.css'

type PlanToPlaceVideoProps = {
  /** True once the chapter is close to the viewport: only then is the file requested. */
  near: boolean
  /** True while the chapter is on screen: the video plays only then. */
  visible: boolean
}

/**
 * The chapter's walkthrough video: silent, looping, inline and control-free, played
 * as-is at its own 16:9 shape (never cropped or stretched). Nothing is downloaded until
 * the chapter is near the viewport, it plays only while the chapter is on screen, and
 * under reduced motion it is never loaded or played — the poster, the video's own first
 * frame, stays. It is decorative to the methodology text beside it, so it is exposed as a
 * single labelled image rather than as media with controls.
 */
export function PlanToPlaceVideo({ near, visible }: PlanToPlaceVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const wanted = near && !reducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // React does not always reflect `muted` as an attribute, so set it on the element too.
    video.muted = true
    if (wanted && visible) {
      // play() returns a promise in browsers (absent in some test environments); autoplay
      // can be refused (battery saver, etc.), in which case the poster simply stays
      video.play()?.catch(() => {})
    } else {
      video.pause()
    }
  }, [wanted, visible])

  return (
    <div className={styles.media} role="img" aria-label={fromPlanToPlaceVideo.label}>
      <video
        ref={videoRef}
        className={styles.video}
        src={wanted ? fromPlanToPlaceVideo.src : undefined}
        poster={fromPlanToPlaceVideo.poster}
        width={fromPlanToPlaceVideo.width}
        height={fromPlanToPlaceVideo.height}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
      />
    </div>
  )
}
