import { useRef } from 'react'
import { Button } from '../components/buttons/Button'
import { Container } from '../components/layout/Container'
import { ServiceDetail } from '../components/service/ServiceDetail'
import { useRevealOnScroll } from '../animations/useRevealOnScroll'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildServicesSeo } from '../utils/servicesSeo'
import { formatList } from '../utils/formatList'
import { primaryCta } from '../data/navigation'
import { processSteps } from '../data/process'
import { projects } from '../data/projects'
import { services } from '../data/services'
import { site } from '../data/site'
import styles from './ServicesPage.module.css'
import { Heading } from '../components/heading/Heading'

const stats = [
  { value: site.stats.yearsExperience, label: 'Years of experience' },
  { value: site.stats.completedProjects, label: 'Completed projects' },
  { value: String(site.stats.ongoingProjects), label: 'Ongoing projects' },
] as const

/**
 * /services — an editorial presentation of the three verified service
 * categories (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md "Services",
 * docs/DESIGN-SYSTEM.md §11). Everything is read from existing data:
 * src/data/services.ts for the services themselves, process.ts for the
 * approved five steps, site.ts for the client-stated figures, and
 * projects.ts for related work. The long description, image, highlights and
 * related projects of each service stay unrendered until the client approves
 * them (see ServiceDetail) — the page is built to fill in as that content
 * arrives, never to invent it.
 */
export function ServicesPage() {
  useDocumentMeta(buildServicesSeo())

  const heroRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(heroRef, { y: 32 })

  const overviewRef = useRef<HTMLOListElement>(null)
  useRevealOnScroll(overviewRef, { y: 24 })

  const processRef = useRef<HTMLOListElement>(null)
  useRevealOnScroll(processRef, { y: 24 })

  const proofRef = useRef<HTMLDListElement>(null)
  useRevealOnScroll(proofRef, { y: 16 })

  return (
    <>
      {/* 01 — Intro */}
      <section className={styles.hero} aria-labelledby="services-hero-heading">
        <Container>
          <div ref={heroRef} className={styles.heroInner}>
            <Heading as="h1" id="services-hero-heading" className={styles.heroHeading}>
              Villas, apartments and residential construction.
            </Heading>
            <p className={styles.heroSupporting}>
              {site.name} builds across {formatList(site.serviceAreas)} — guided by{' '}
              {formatList(site.values).toLowerCase()} at every stage.
            </p>
          </div>
        </Container>
      </section>

      {/* 02 — Overview: an index of the services, linking to each one below */}
      <section className={styles.overview} aria-labelledby="services-overview-heading">
        <Container>
          <Heading as="h2" id="services-overview-heading" className={styles.sectionHeading}>
            What we build.
          </Heading>
          <nav aria-label="Services">
            <ol ref={overviewRef} className={styles.overviewList}>
              {services.map((service) => (
                <li key={service.slug} className={styles.overviewItem}>
                  <a href={`#${service.slug}`} className={styles.overviewLink}>
                    <span className={`text-mono-label ${styles.index}`}>{service.index}</span>
                    <span className={styles.overviewTitle}>
                      {service.pageTitle ?? service.title}
                    </span>
                    <span className={styles.overviewDescription}>{service.shortDescription}</span>
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

      {/* 03 — Each service in turn */}
      {services.map((service, i) => (
        <ServiceDetail
          key={service.slug}
          service={service}
          relatedProjects={projects.filter((project) => project.category === service.category)}
          align={i % 2 === 0 ? 'start' : 'end'}
        />
      ))}

      {/* 04 — The approved process every project follows (src/data/process.ts) */}
      <section className={styles.block} aria-labelledby="services-process-heading">
        <Container>
          <Heading as="h2" id="services-process-heading" className={styles.sectionHeading}>
            How every project runs.
          </Heading>
          <ol ref={processRef} className={styles.steps}>
            {processSteps.map((step) => (
              <li key={step.title} className={styles.step}>
                <span className={`text-mono-label ${styles.index}`}>{step.index}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 05 — Proof: the client-stated figures, as on the homepage */}
      <section className={styles.block} aria-label={`${site.name} in numbers`}>
        <Container>
          <dl ref={proofRef} className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA — the site's existing primary CTA, no invented contact details */}
      <section className={styles.cta} aria-labelledby="services-cta-heading">
        <Container>
          <div className={styles.ctaInner}>
            <Heading as="h2" id="services-cta-heading" className={styles.ctaHeading}>
              Start a project.
            </Heading>
            <Button to={primaryCta.to} variant="primary">
              {primaryCta.label}
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
