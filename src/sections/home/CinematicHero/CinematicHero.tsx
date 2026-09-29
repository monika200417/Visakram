import { useRef } from 'react'
import { HeroContent } from './HeroContent'
import { HeroVisualStage } from './HeroVisualStage'
import { ScrollIndicator } from './ScrollIndicator'
import { useHeroEntrance } from './useHeroEntrance'
import { useHeroSceneScrub } from './useHeroSceneScrub'
import styles from './CinematicHero.module.css'

/**
 * Cinematic architectural arrival (Milestone 3). Scroll-driven, not a
 * background-video hero — see src/data/heroScenes.ts for the layered scene
 * system this is built on.
 */
export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null)

  useHeroEntrance(sectionRef)
  useHeroSceneScrub(sectionRef)

  return (
    <section ref={sectionRef} className={styles.hero}>
      <HeroVisualStage />
      <div className={styles.contentWrap}>
        <HeroContent />
      </div>
      <ScrollIndicator />
    </section>
  )
}
