import { CinematicHero } from '../sections/home/CinematicHero/CinematicHero'
import { FeaturedProjectSection } from '../sections/home/FeaturedProjectSection/FeaturedProjectSection'
import { HowWeBuildSection } from '../sections/home/HowWeBuildSection/HowWeBuildSection'
import { ProofSection } from '../sections/home/ProofSection/ProofSection'
import { StatementSection } from '../sections/home/StatementSection/StatementSection'
import { VisakramWaySection } from '../sections/home/VisakramWaySection/VisakramWaySection'
import { WhatWeBuildSection } from '../sections/home/WhatWeBuildSection/WhatWeBuildSection'

/**
 * Milestone 4 scope: hero, statement, proof, what we build, featured
 * project, the Visakram way, and how we build. Remaining homepage chapters
 * (3D plan-to-place story, project archive, founders, customer stories,
 * local presence, final CTA) follow in later milestones.
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
      <HowWeBuildSection />
    </>
  )
}
