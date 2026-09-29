import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Button } from '../components/buttons/Button'
import { DevImagePlaceholder } from '../components/media/DevImagePlaceholder'
import { FounderProfile } from '../components/founder/FounderProfile'
import { useRevealOnScroll } from '../animations/useRevealOnScroll'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildAboutSeo } from '../utils/aboutSeo'
import { formatList } from '../utils/formatList'
import { site } from '../data/site'
import { services } from '../data/services'
import { founders } from '../data/founders'
import { visakramWayPrinciples } from '../data/visakramWay'
import { primaryCta } from '../data/navigation'
import styles from './AboutPage.module.css'

/**
 * /about — Milestone 7. An editorial narrative built entirely from
 * already-verified content (src/data/site.ts, services.ts, founders.ts,
 * visakramWay.ts) — no invented slogan, title, statistic or claim.
 * Section order follows the blueprint's own trust arc: experience, what
 * Visakram builds, values, the two founders, why that combination reads
 * as established, and where the company actually builds.
 */
export function AboutPage() {
  useDocumentMeta(buildAboutSeo())

  const heroRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(heroRef, { y: 32 })

  const experienceRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(experienceRef, { y: 24 })

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
            <p className={`text-mono-label ${styles.eyebrow}`}>01 — About</p>
            <h1 id="about-hero-heading" className={styles.heroHeading}>
              {site.stats.yearsExperience} years of construction experience, carried into a
              contemporary way of building.
            </h1>
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
                <DevImagePlaceholder label={site.name} />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 02 — Experience */}
      <section className={styles.section} aria-labelledby="experience-heading">
        <Container>
          <p className={`text-mono-label ${styles.eyebrow}`}>02 — Experience</p>
          <div ref={experienceRef} className={styles.experienceRow}>
            <p className={styles.experienceValue}>{site.stats.yearsExperience}</p>
            <div className={styles.experienceText}>
              <h2 id="experience-heading" className={styles.sectionHeading}>
                Years of construction experience.
              </h2>
              <p className={styles.supporting}>
                That experience now carries into a contemporary approach to residential building —{' '}
                {site.stats.completedProjects} completed projects and {site.stats.ongoingProjects}{' '}
                currently underway, across {formatList(site.serviceAreas)}.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — What Visakram builds (reuses src/data/services.ts) */}
      <section className={styles.section} aria-labelledby="build-heading">
        <Container>
          <p className={`text-mono-label ${styles.eyebrow}`}>03 — What We Build</p>
          <h2 id="build-heading" className={styles.sectionHeading}>
            What we build.
          </h2>
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
          <p className={`text-mono-label ${styles.eyebrow}`}>04 — Values</p>
          <h2 id="values-heading" className={styles.sectionHeading}>
            {formatList(site.values)}.
          </h2>
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
          <p className={`text-mono-label ${styles.eyebrow}`}>05 — Founders</p>
          <h2 id="founders-heading" className={styles.sectionHeading}>
            Two backgrounds. One direction.
          </h2>
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
          <p className={`text-mono-label ${styles.eyebrow}`}>06 — Why Visakram</p>
          <div ref={trustRef} className={styles.trustInner}>
            <h2 id="trust-heading" className={styles.sectionHeading}>
              Established, not assumed.
            </h2>
            <p className={styles.supporting}>
              {site.stats.yearsExperience} years of construction experience. Two founders with
              complementary backgrounds. {formatList(site.values)} at every stage. That combination
              is what {site.name} builds from — villas, apartments and residential construction
              across {formatList(site.serviceAreas)}.
            </p>
          </div>
        </Container>
      </section>

      {/* 07 — Local presence */}
      <section className={styles.section} aria-labelledby="local-heading">
        <Container>
          <p className={`text-mono-label ${styles.eyebrow}`}>07 — Where We Build</p>
          <div ref={localRef} className={styles.localInner}>
            <h2 id="local-heading" className={styles.sectionHeading}>
              {formatList(site.serviceAreas)}.
            </h2>
            <p className={styles.supporting}>
              {site.name} is based in {site.locality}, {site.city}, {site.region}, building across{' '}
              {formatList(site.serviceAreas)}.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA — reuses the site's existing primary CTA, no invented contact details */}
      <section className={styles.cta} aria-labelledby="about-cta-heading">
        <Container>
          <h2 id="about-cta-heading" className={styles.ctaHeading}>
            Start a project.
          </h2>
          <Button to={primaryCta.to} variant="primary">
            {primaryCta.label}
          </Button>
        </Container>
      </section>
    </>
  )
}
