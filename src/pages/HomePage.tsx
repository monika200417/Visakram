import { EagleHero } from '../sections/home/EagleHero/EagleHero'
import { AmenitiesSection } from '../sections/home/AmenitiesSection/AmenitiesSection'
import { ClosingSection } from '../sections/home/ClosingSection/ClosingSection'
import { FromPlanToPlaceSection } from '../sections/home/FromPlanToPlaceSection/FromPlanToPlaceSection'
import { HomeTourVideoSection } from '../sections/home/HomeTourVideoSection/HomeTourVideoSection'
import { HowWeBuildSection } from '../sections/home/HowWeBuildSection/HowWeBuildSection'
import { LocalPresenceSection } from '../sections/home/LocalPresenceSection/LocalPresenceSection'
import { OurStorySection } from '../sections/home/OurStorySection/OurStorySection'
import { TestimonialsSection } from '../sections/home/TestimonialsSection/TestimonialsSection'
import { StatementSection } from '../sections/home/StatementSection/StatementSection'
import { VisakramWaySection } from '../sections/home/VisakramWaySection/VisakramWaySection'
import { WhatWeBuildSection } from '../sections/home/WhatWeBuildSection/WhatWeBuildSection'

/**
 * Order note: How We Build (Chapter 08) sits third, between the Home Tour and the Statement. The Home Tour film (Chapter 07B) is the second page of the homepage — it follows the
 * eagle hero directly, so the hero's scroll zoom through the building window flows into the tour's
 * first room. The remaining chapters keep their blueprint order after it.
 *
 * Milestone 4 scope: the eagle hero (it replaced the Cinematic scroll-film hero, which is still in
 * src/sections/home/CinematicHero but no longer rendered), statement, proof, what we build, featured
 * project, the Visakram way, and how we build. The Testimonials
 * carousel (Chapter 11, which replaced the Customer Stories chapter) follows how we
 * build (Chapter 08) — Chapters
 * 09 (Project Archive) and 10 (Founders) became their own pages instead of
 * homepage chapters. Milestone 10 adds Chapter 07 (From Plan to Place)
 * between the Visakram Way (06) and How We Build (08), matching the
 * blueprint's chapter order. The closing run — Local Presence (12) and the
 * Cinematic Closing (14) — follows Testimonials and ends on the footer. The Featured Project
 * chapter (05) is not a section of its own: the featured project is the last card of the What We
 * Build carousel (src/sections/home/WhatWeBuildSection/FeaturedProjectCard.tsx). Its old section is
 * kept in src/sections/home/FeaturedProjectSection but not rendered. Chapter 13
 * (Start a Project) is not on the homepage; its section is kept in
 * src/sections/home/StartProjectSection but not rendered.
 */
export function HomePage() {
  return (
    <>
      <EagleHero />
      <HomeTourVideoSection />
      <HowWeBuildSection />
      <StatementSection />
      <WhatWeBuildSection />
      <AmenitiesSection />
      <VisakramWaySection />
      <FromPlanToPlaceSection />
      <OurStorySection />
      <TestimonialsSection />
      <LocalPresenceSection />
      <ClosingSection />
    </>
  )
}
