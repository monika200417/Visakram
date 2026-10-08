import { heroFilm, heroPoster } from '../../../data/heroFilm'
import styles from './HeroVisualStage.module.css'

/**
 * The hero's picture: a poster still with a canvas laid over it. The poster is
 * a plain <img> in the DOM from the first render — it is what the visitor sees
 * immediately, the largest-contentful-paint candidate, and the complete
 * experience wherever the film does not run (narrow screens, reduced motion,
 * data-saver, or before the frames have loaded). On wide screens with motion
 * allowed, useHeroSceneScrub fills the canvas from the hero frame sequence and
 * flips `data-film` to "ready", which fades the canvas in over the identical
 * first frame. Purely decorative — the real hero content is HeroContent — so
 * the whole stage is aria-hidden.
 */
export function HeroVisualStage() {
  return (
    <div
      className={styles.stage}
      style={{ ['--hero-focal-x' as string]: `${heroFilm.focalX * 100}%` }}
      aria-hidden="true"
      data-hero-stage
    >
      <img
        src={heroPoster}
        alt=""
        width={heroFilm.width}
        height={heroFilm.height}
        className={styles.poster}
        decoding="async"
        fetchPriority="high"
      />
      <canvas className={styles.canvas} data-hero-canvas />
      <div className={styles.overlay} />
    </div>
  )
}
