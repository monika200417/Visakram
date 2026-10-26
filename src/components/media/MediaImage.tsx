import { useCallback, useState } from 'react'
import styles from './Media.module.css'

type MediaImageProps = {
  src: string
  alt: string
  /** Set for the first image on a page that should not wait. */
  priority?: boolean
}

/**
 * A photograph that fills its positioned parent (`object-fit: cover`) with a graceful loading
 * state: a breathing stone field until it has loaded, then a fade in. The parent owns the box,
 * its aspect ratio and any hover zoom. Loaded state is one low-frequency React update per image.
 */
export function MediaImage({ src, alt, priority = false }: MediaImageProps) {
  const [loaded, setLoaded] = useState(false)

  // An image that was already cached may have finished before React attached `onLoad`.
  const ref = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <>
      {loaded ? null : <span className={styles.skeleton} aria-hidden="true" />}
      <img
        ref={ref}
        className={styles.fill}
        data-loaded={loaded}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}
