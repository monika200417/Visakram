import { heroScenes } from '../../../data/heroScenes'
import { DevScenePlaceholder } from '../../../components/media/DevScenePlaceholder'
import styles from './HeroVisualStage.module.css'

/**
 * Layered scene stack. Purely decorative — the meaningful hero content
 * lives in HeroContent as real text, so this whole stage is aria-hidden.
 * The first scene is opaque by default in CSS; every other layer starts
 * transparent. That default IS the complete mobile / reduced-motion
 * experience (a single static scene) — useHeroSceneScrub only overrides it
 * for desktop/tablet with motion allowed. Supports one scene, many layered
 * scenes, or (later) video in a scene's slot without changing this shape.
 */
export function HeroVisualStage() {
  return (
    <div className={styles.stage} aria-hidden="true">
      {heroScenes.map((scene) => (
        <div key={scene.id} className={styles.layer} data-hero-layer>
          {scene.image ? (
            <img src={scene.image} alt="" className={styles.image} />
          ) : (
            <DevScenePlaceholder scene={scene} total={heroScenes.length} />
          )}
        </div>
      ))}
      <div className={styles.overlay} />
    </div>
  )
}
