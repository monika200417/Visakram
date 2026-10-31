import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Button } from '../components/buttons/Button'
import { FounderProfile } from '../components/founder/FounderProfile'
import { NoBreak } from '../components/text/NoBreak'
import { useRevealOnScroll } from '../animations/useRevealOnScroll'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildAboutSeo } from '../utils/aboutSeo'
import { formatList } from '../utils/formatList'
import { site } from '../data/site'
import { services } from '../data/services'
import { aboutCollage } from '../data/aboutCollage'
import { founders } from '../data/founders'
import { visakramWayPrinciples } from '../data/visakramWay'
import { primaryCta } from '../data/navigation'
import styles from './AboutPage.module.css'
import { Heading } from '../components/heading/Heading'

/**
 * /about — Milestone 7. An editorial narrative built entirely from
 * already-verified content (src/data/site.ts, services.ts, founders.ts,
 * visakramWay.ts) — no invented slogan, title, statistic or claim.
 * Section order follows the blueprint's own trust arc: what
 * Visakram builds, values, the two founders, why that combination reads
 * as established, and where the company actually builds.
 */
export function AboutPage() {
  useDocumentMeta(buildAboutSeo())

  const heroRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(heroRef, { y: 32 })

  const buildRef = useRef<HTMLOListElement>(null)
  useRevealOnScroll(buildRef, { y: 24 })

  const valuesRef = useRef<HTMLOListElement>(null)
  useRevealOnScroll(valuesRef, { y: 24 })

  const convergeRef = useRef<HTMLParagraphElement>(null)
  useRevealOnScroll(convergeRef, { y: 16 })

  const trustRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(trustRef, { y: 24 })

  const localRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(localRef, { y: 24 })

  return (
    <>
      {/* 01 — About hero */}
      <section className={styles.hero} aria-labelledby="about-hero-heading">
        <Container>
          <div ref={heroRef} className={styles.heroInner}>
            <Heading as="h1" id="about-hero-heading" className={styles.heroHeading}>
              {site.stats.yearsExperience} years of construction experience, carried into a
              contemporary way of building.
            </Heading>
            <p className={styles.heroSupporting}>
              {site.name} is a residential construction company delivering villas, apartments and
              residential construction across {formatList(site.serviceAreas)} — guided by{' '}
              {formatList(site.values).toLowerCase()} at every stage.
            </p>
            <div className={styles.heroMedia}>
              {site.aboutImage ? (
                <img
                  src={site.aboutImage.src}
                  alt={site.aboutImage.alt}
                  className={styles.heroPhoto}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <ul className={styles.collage}>
                  {aboutCollage.map((image, i) => (
                    <li
                      key={image.src}
                      className={styles.collageTile}
                      style={
                        {
                          '--ratio': image.ratio,
                          '--ratio-phone': image.ratioPhone,
                        } as CSSProperties
                      }
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — What Visakram builds (reuses src/data/services.ts) */}
      <section className={styles.section} aria-labelledby="build-heading">
        <Container>
          <Heading as="h2" id="build-heading" className={styles.sectionHeading}>
            What we build.
          </Heading>
          <ol ref={buildRef} className={styles.serviceList}>
            {services.map((service) => (
              <li key={service.slug} className={styles.serviceItem}>
                <span className={`text-mono-label ${styles.index}`}>{service.index}</span>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.shortDescription}</p>
              </li>
            ))}
          </ol>
          <Link to="/services" className={styles.inlineLink}>
            View all services <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>

      {/* 04 — Values / trust (reuses src/data/visakramWay.ts) */}
      <section className={styles.section} aria-labelledby="values-heading">
        <Container>
          <Heading as="h2" id="values-heading" className={styles.sectionHeading}>
            {formatList(site.values)}.
          </Heading>
          <ol ref={valuesRef} className={styles.valuesList}>
            {visakramWayPrinciples.map((principle) => (
              <li key={principle.title} className={styles.valueItem}>
                <span className={`text-mono-label ${styles.index}`}>{principle.index}</span>
                <h3 className={styles.valueTitle}>{principle.title}</h3>
                <p className={styles.valueDescription}>{principle.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 05 — Founders: "Two backgrounds. One direction." */}
      <section className={styles.section} aria-labelledby="founders-heading">
        <Container>
          <Heading as="h2" id="founders-heading" className={styles.sectionHeading}>
            Two backgrounds. One direction.
          </Heading>
          <div className={styles.founders}>
            {founders.map((founder, i) => (
              <FounderProfile
                key={founder.slug}
                founder={founder}
                align={i % 2 === 0 ? 'start' : 'end'}
              />
            ))}
          </div>
          <p ref={convergeRef} className={styles.converge}>
            Together — {site.name}.
          </p>
        </Container>
      </section>

      {/* 06 — Trust story: experience → people → values → what we build */}
      <section className={styles.section} aria-labelledby="trust-heading">
        <Container>
          <div ref={trustRef} className={styles.trustInner}>
            <Heading as="h2" id="trust-heading" className={styles.sectionHeading}>
              Credibility Built. Never Claimed.
            </Heading>
            <ul className={styles.proof}>
              <li>
                <span className={styles.proofValue}>{site.stats.yearsExperience}</span>
                <span className={styles.proofLabel}>Years of experience</span>
              </li>
              <li>
                <span className={styles.proofValue}>{site.stats.completedProjects}</span>
                <span className={styles.proofLabel}>Projects</span>
              </li>
              <li>
                <span className={styles.proofValue}>{site.stats.ongoingProjects}</span>
                <span className={styles.proofLabel}>Ongoing projects</span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* 07 — Local presence */}
      <section className={styles.section} aria-labelledby="local-heading">
        <Container>
          <div ref={localRef} className={styles.localInner}>
            <Heading as="h2" id="local-heading" className={styles.sectionHeading}>
              {formatList(site.serviceAreas)}.
            </Heading>
            <p className={styles.supporting}>
              {site.name} is based in {site.locality}, {site.city}, <NoBreak>{site.region}</NoBreak>
              , building across {formatList(site.serviceAreas)}.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA — reuses the site's existing primary CTA, no invented contact details */}
      <section className={styles.cta} aria-labelledby="about-cta-heading">
        <Container>
          <Heading as="h2" id="about-cta-heading" className={styles.ctaHeading}>
            Let’s Create a Lasting Legacy.
          </Heading>
          <Button to={primaryCta.to} variant="primary">
            {primaryCta.label}
          </Button>
        </Container>
      </section>
    </>
  )
}
