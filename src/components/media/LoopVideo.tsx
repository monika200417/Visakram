import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './Media.module.css'

type LoopVideoProps = {
  src: string
  poster?: string
  /** Accessible description, when one was supplied with the video; otherwise it is decorative. */
  alt?: string
}

/**
 * A silent looping video that fills its positioned parent (`object-fit: cover`) with the same
 * loading state as MediaImage. It is requested only once it is near the viewport, plays only
 * while on screen, and under reduced motion never plays (only its first frame is fetched). Muted, inline and control-free, as autoplay policies require.
 */
export function LoopVideo({ src, poster, alt }: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          nearObserver.disconnect()
        }
      },
      { rootMargin: '500px 0px' },
    )
    const liveObserver = new IntersectionObserver(([entry]) =>
      setVisible(Boolean(entry?.isIntersecting)),
    )
    nearObserver.observe(video)
    liveObserver.observe(video)
    return () => {
      nearObserver.disconnect()
      liveObserver.disconnect()
    }
  }, [])

  // Under reduced motion the file is still fetched (metadata only) so its first frame shows,
  // but it never plays.
  const wanted = near
  const playing = wanted && visible && !reducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // React does not always reflect `muted` as an attribute, so set it on the element too.
    video.muted = true
    if (playing) {
      // play() returns a promise in browsers (absent in some test environments); autoplay can
      // be refused, in which case the first frame simply stays.
      video.play()?.catch(() => {})
    } else {
      video.pause()
    }
  }, [playing])

  return (
    <>
      {ready ? null : <span className={styles.skeleton} aria-hidden="true" />}
      <video
        ref={videoRef}
        className={styles.fill}
        data-loaded={ready}
        src={wanted ? src : undefined}
        poster={poster}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        controls={false}
        preload={reducedMotion ? 'metadata' : 'none'}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-label={alt}
        aria-hidden={alt ? undefined : true}
        onLoadedData={() => setReady(true)}
      />
    </>
  )
}
