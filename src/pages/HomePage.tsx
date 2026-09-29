import { CinematicHero } from '../sections/home/CinematicHero/CinematicHero'
import { ProofSection } from '../sections/home/ProofSection/ProofSection'
import { StatementSection } from '../sections/home/StatementSection/StatementSection'

/**
 * Milestone 3 scope: hero + statement + initial proof chapter only.
 * Remaining homepage chapters (services, featured project, Visakram Way,
 * process, archive, founders, testimonials, local presence, final CTA, 3D
 * story) follow in Milestones 4–11.
 */
export function HomePage() {
  return (
    <>
      <CinematicHero />
      <StatementSection />
      <ProofSection />
    </>
  )
}
