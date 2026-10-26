import { useRef } from 'react'
import { Button } from '../components/buttons/Button'
import { Container } from '../components/layout/Container'
import { ProcessJourney } from '../components/process/ProcessJourney'
import { useRevealOnScroll } from '../animations/useRevealOnScroll'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildProcessSeo } from '../utils/processSeo'
import { toAnchorId } from '../utils/anchorId'
import { formatList } from '../utils/formatList'
import { primaryCta } from '../data/navigation'
import { processSteps } from '../data/process'
import { site } from '../data/site'
import styles from './ProcessPage.module.css'
import { Heading } from '../components/heading/Heading'

const first = processSteps[0]
const last = processSteps[processSteps.length - 1]

/**
 * /process — the dedicated companion to the homepage's "How We Build"
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md "Process": a detailed
 * but visually simple page; animation clarifies the journey). Everything is
 * read from src/data/process.ts — the approved five steps — and the verified
 * facts in src/data/site.ts. The page deliberately adds room and sequence
 * (an overview, then one chapter per stage along a progress line), not
 * content: no durations, guarantees, deliverables or per-stage claims exist
 * in the data, so none are shown. Per-stage detail can be added to
 * process.ts later and rendered by ProcessJourney without a page rewrite.
 */
export function ProcessPage() {
  useDocumentMeta(buildProcessSeo())

  const heroRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(heroRef, { y: 32 })

  const overviewRef = useRef<HTMLOListElement>(null)
  useRevealOnScroll(overviewRef, { y: 24 })

  const hasSteps = processSteps.length > 0

  return (
    <>
      {/* 01 — Intro */}
      <section className={styles.hero} aria-labelledby="process-hero-heading">
        <Container>
          <div ref={heroRef} className={styles.heroInner}>
            <Heading as="h1" id="process-hero-heading" className={styles.heroHeading}>
              {first && last
                ? `From ${first.title.toLowerCase()} to ${last.title.toLowerCase()}.`
                : 'Our construction process.'}
            </Heading>
            <p className={styles.heroSupporting}>
              How {site.name} runs a project across {formatList(site.serviceAreas)}
              {hasSteps ? ` — in ${processSteps.length} stages` : ''}, guided by{' '}
              {formatList(site.values).toLowerCase()}.
            </p>
          </div>
        </Container>
      </section>

      {hasSteps ? (
        <>
          {/* 02 — Overview: the whole sequence at a glance */}
          <section className={styles.overview} aria-labelledby="process-overview-heading">
            <Container>
              <Heading as="h2" id="process-overview-heading" className={styles.sectionHeading}>
                The sequence.
              </Heading>
              <nav aria-label="Process stages">
                <ol ref={overviewRef} className={styles.overviewList}>
                  {processSteps.map((step) => (
                    <li key={step.title} className={styles.overviewItem}>
                      <a href={`#${toAnchorId(step.title)}`} className={styles.overviewLink}>
                        <span className={`text-mono-label ${styles.index}`}>{step.index}</span>
                        <span className={styles.overviewTitle}>{step.title}</span>
                        <span className={styles.arrow} aria-hidden="true">
                          ↓
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Container>
          </section>

          {/* 03 — The journey: one chapter per stage along a progress line */}
          <section className={styles.journeySection} aria-labelledby="process-journey-heading">
            <Container>
              <div className={styles.journeyIntro}>
                <Heading as="h2" id="process-journey-heading" className={styles.sectionHeading}>
                  Stage by stage.
                </Heading>
              </div>
              <ProcessJourney steps={processSteps} />
            </Container>
          </section>
        </>
      ) : null}

      {/* CTA — the site's existing primary CTA, no invented contact details */}
      <section className={styles.cta} aria-labelledby="process-cta-heading">
        <Container>
          <div className={styles.ctaInner}>
            <Heading as="h2" id="process-cta-heading" className={styles.ctaHeading}>
              Start a project.
            </Heading>
            <div className={styles.ctaActions}>
              <Button to={primaryCta.to} variant="primary">
                {primaryCta.label}
              </Button>
              <Button to="/services" variant="secondary">
                Explore services
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
