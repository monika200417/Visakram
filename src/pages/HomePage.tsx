import { CinematicHero } from '../sections/home/CinematicHero/CinematicHero'
import { ClosingSection } from '../sections/home/ClosingSection/ClosingSection'
import { CustomerStoriesSection } from '../sections/home/CustomerStoriesSection/CustomerStoriesSection'
import { FeaturedProjectSection } from '../sections/home/FeaturedProjectSection/FeaturedProjectSection'
import { FromPlanToPlaceSection } from '../sections/home/FromPlanToPlaceSection/FromPlanToPlaceSection'
import { HomeTourSection } from '../sections/home/HomeTourSection/HomeTourSection'
import { HowWeBuildSection } from '../sections/home/HowWeBuildSection/HowWeBuildSection'
import { LocalPresenceSection } from '../sections/home/LocalPresenceSection/LocalPresenceSection'
import { ProofSection } from '../sections/home/ProofSection/ProofSection'
import { StartProjectSection } from '../sections/home/StartProjectSection/StartProjectSection'
import { StatementSection } from '../sections/home/StatementSection/StatementSection'
import { VisakramWaySection } from '../sections/home/VisakramWaySection/VisakramWaySection'
import { WhatWeBuildSection } from '../sections/home/WhatWeBuildSection/WhatWeBuildSection'

/**
 * Milestone 4 scope: hero, statement, proof, what we build, featured
 * project, the Visakram way, and how we build. Milestone 8 adds customer
 * stories (Chapter 11) directly after how we build (Chapter 08) — Chapters
 * 09 (Project Archive) and 10 (Founders) became their own pages instead of
 * homepage chapters. Milestone 10 adds Chapter 07 (From Plan to Place)
 * between the Visakram Way (06) and How We Build (08), matching the
 * blueprint's chapter order. The closing run — Local Presence (12), Start a
 * Project (13) and the Cinematic Closing (14) — follows Customer Stories and
 * ends on the footer.
 */
export function HomePage() {
  return (
    <>
      <CinematicHero />
      <StatementSection />
      <ProofSection />
      <WhatWeBuildSection />
      <FeaturedProjectSection />
      <VisakramWaySection />
      <FromPlanToPlaceSection />
      <HomeTourSection />
      <HowWeBuildSection />
      <CustomerStoriesSection />
      <LocalPresenceSection />
      <StartProjectSection />
      <ClosingSection />
    </>
  )
}
