import type { HeroScene } from '../../data/heroScenes'
import styles from './DevScenePlaceholder.module.css'

type DevScenePlaceholderProps = {
  scene: HeroScene
  total: number
}

/**
 * Stand-in for real architectural photography/video. Clearly marked so it
 * can never be mistaken for finished content and is trivial to audit before
 * launch: `grep -r data-dev-placeholder src` must return nothing.
 */
export function DevScenePlaceholder({ scene, total }: DevScenePlaceholderProps) {
  return (
    <div className={styles.placeholder} data-dev-placeholder>
      <span className={styles.tag}>
        Dev placeholder · {scene.chapter}/{String(total).padStart(2, '0')} · {scene.title}
      </span>
    </div>
  )
}
