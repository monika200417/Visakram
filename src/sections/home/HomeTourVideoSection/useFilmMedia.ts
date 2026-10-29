import { useEffect, useState, type RefObject } from 'react'

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
 * Whether to take the light film (the 540p copy, about 4 MB) rather than the 1080p one (about 15 MB): on a
 * phone-width screen, and on any screen whose connection reports itself as slow (2G/3G). Read once: the film
 * is not swapped mid-scrub if the window or the connection changes.
 */
export function useLightFilm(): boolean {
  const [light] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia?.('(max-width: 767px)').matches === true) return true
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
      .connection
    return (
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === '3g'
    )
  })
  return light
}

/**
 * Owns the video's network lifecycle. When the film is wanted it is downloaded whole, once, and played from
 * memory: the file is fetched as a blob and handed to the video as an object URL. A browser given a plain
 * address fetches a paused video only part-way ahead (Chrome stops at about half of this one), so skipping
 * into a part not yet fetched waits on the network, and on a phone that is a visible stall in the middle of
 * a swipe. From memory every seek is local. Until the blob has arrived the poster (the film's first frame) is
 * shown. If the blob cannot be made (no fetch, or the request fails) the plain address is used, as before.
 *
 * When the film is no longer wanted (the visitor scrolled far away, or reduced motion switched on) the
 * request is aborted, the source removed and `load()` called on the empty element, which releases the
 * decoder, and the object URL is revoked, which releases the file.
 */
export function useFilmSource(
  videoRef: RefObject<HTMLVideoElement | null>,
  wanted: boolean,
  url: string,
) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || !wanted) return

    const controller = new AbortController()
    let objectUrl: string | undefined
    const play = (src: string) => {
      video.src = src
      video.load()
    }
    const canMakeBlob = typeof fetch === 'function' && typeof URL.createObjectURL === 'function'

    if (canMakeBlob) {
      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`Film request failed: ${response.status}`)
          return response.blob()
        })
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob)
          play(objectUrl)
        })
        .catch(() => {
          if (!controller.signal.aborted) play(url)
        })
    } else {
      play(url)
    }

    return () => {
      controller.abort()
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [videoRef, wanted, url])
}
