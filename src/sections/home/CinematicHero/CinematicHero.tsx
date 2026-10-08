import { useRef } from 'react'
import { HeroContent } from './HeroContent'
import { HeroVisualStage } from './HeroVisualStage'
import { ScrollIndicator } from './ScrollIndicator'
import { useHeroEntrance } from './useHeroEntrance'
import { useHeroSceneScrub } from './useHeroSceneScrub'
import styles from './CinematicHero.module.css'

/**
 * Cinematic architectural arrival (Milestone 3). A poster still, and — on wide
 * screens with motion allowed — a short film of the house scrubbed by the page
 * scroll; see src/data/heroFilm.ts and useHeroSceneScrub. The headline and
 * calls to action stay put throughout.
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
