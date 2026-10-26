import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Whether the film is worth having loaded, with hysteresis. It is wanted once
 * the element comes within `enterMargin` of the viewport, and only released
 * once it is beyond the much larger `leaveMargin`. A single margin would drop
 * the film the moment a quick scroll overshoots the section, and the visitor
 * scrolling straight back would then wait for it to reload (showing the poster,
 * which is the wrong frame). A low-frequency React update — once per approach
 * or departure, never per scroll frame.
 */
export function useNearViewport(
  ref: RefObject<HTMLElement | null>,
  enterMargin = '120% 0px',
  leaveMargin = '400% 0px',
) {
  // Without IntersectionObserver there is no way to know, so the film is simply allowed.
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') return
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true)
      },
      { rootMargin: enterMargin },
    )
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting) setNear(false)
      },
      { rootMargin: leaveMargin },
    )
    enter.observe(element)
    leave.observe(element)
    return () => {
      enter.disconnect()
      leave.disconnect()
    }
  }, [ref, enterMargin, leaveMargin])

  return near
}

type NetworkInformationLike = { saveData?: boolean }

/** The visitor's data-saver preference, read once. Data-saver gets the still, not a 30 MB film. */
export function useSaveData(): boolean {
  const [saveData] = useState(() => {
    if (typeof navigator === 'undefined') return false
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
    return connection?.saveData === true
  })
  return saveData
}

/**
 * Owns the video's network lifecycle. When the film is wanted, the `src` prop
 * is set but `preload="none"` means the browser fetches nothing on its own,
 * so `load()` starts it. When it is no longer wanted (the visitor scrolled far
 * away, or reduced motion switched on), setting `src` to undefined removes the
 * attribute but the browser keeps the media pipeline alive until `load()` is
 * called on an element with no source — so that releases the download and decoder.
 */
export function useFilmSource(videoRef: RefObject<HTMLVideoElement | null>, wanted: boolean) {
  const hadSource = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (wanted) {
      hadSource.current = true
      if (video.getAttribute('src') && video.readyState === 0) video.load()
      return
    }
    if (!hadSource.current) return
    hadSource.current = false
    video.pause()
    video.removeAttribute('src')
    video.load()
  }, [videoRef, wanted])
}
