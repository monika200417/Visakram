import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { NoBreak } from '../../../components/text/NoBreak'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { site } from '../../../data/site'
import { CountUp } from './CountUp'
import styles from './StatementSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * The three verified figures (src/data/site.ts), each on a card with a background photograph that
 * says what the figure is about: a tower for the years of experience, people on site for the
 * completed projects, a building going up for the ongoing ones. The tower is a stock photograph
 * (see the README files under public/assets); the other two are the supplied project photographs
 * in public/assets/home-media (proof-completed, proof-ongoing).
 */
const cards = [
  {
    value: site.stats.yearsExperience,
    label: 'Years of experience',
    image: '/assets/testimonials/04-tower-glass.jpg',
    position: '50% 50%',
  },
  {
    value: site.stats.completedProjects,
    label: 'Completed projects',
    image: '/assets/home-media/proof-completed.png',
    position: '50% 62%',
  },
  {
    value: String(site.stats.ongoingProjects),
    label: 'Ongoing projects',
    image: '/assets/home-media/proof-ongoing.webp',
    position: '50% 50%',
  },
] as const

/**
 * Chapters 02 and 03 — Statement and Proof (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md
 * §05). The statement and its supporting line sit on the left; on the right the three verified
 * figures are cards on a slowly twirling ring. A card turns Visakram orange when hovered (and the
 * ring pauses so it can be read). Verified facts only; each figure counts up once as it scrolls in.
 *
 * The twirl is CSS 3D only. Under reduced motion the ring does not turn: the cards sit side by side,
 * flat, and still change colour on hover.
 */
export function StatementSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef)

  return (
    <section id="statement" className={styles.section} aria-labelledby="statement-heading">
      <Container>
        <div ref={revealRef} className={styles.bento}>
          <div className={styles.copy}>
            <Heading as="h2" id="statement-heading" className={styles.heading}>
              Where Vision Shapes the Future.
            </Heading>
            <p className={styles.supporting}>
              Visakram Builders is a forward thinking real estate development company creating
              distinctive residential, commercial, and mixed use spaces across{' '}
              <NoBreak>Andhra Pradesh</NoBreak>. Driven by innovation, architectural excellence, and
              an unwavering commitment to quality, we transform ambitious visions into thoughtfully
              designed developments built for generations.
            </p>
          </div>

          <div className={styles.proof} role="region" aria-label={`${site.name} in numbers`}>
            <div className={styles.scene}>
              <dl className={styles.ring}>
                {cards.map((card, i) => (
                  <div
                    key={card.label}
                    className={styles.card}
                    style={{ ['--i' as string]: String(i), ['--pos' as string]: card.position }}
                  >
                    <img
                      className={styles.photo}
                      src={card.image}
                      alt=""
                      width={1000}
                      height={667}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.shade} aria-hidden="true" />
                    <span className={styles.tint} aria-hidden="true" />
                    <dt className={styles.value}>
                      <CountUp value={card.value} />
                    </dt>
                    <dd className={styles.label}>{card.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
