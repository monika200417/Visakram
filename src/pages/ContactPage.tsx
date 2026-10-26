import { useRef } from 'react'
import { Container } from '../components/layout/Container'
import { ContactForm } from '../components/form/ContactForm'
import { useRevealOnScroll } from '../animations/useRevealOnScroll'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildContactSeo } from '../utils/contactSeo'
import { buildWhatsAppUrl } from '../utils/buildWhatsAppUrl'
import { telHref } from '../utils/telHref'
import { formatList } from '../utils/formatList'
import { site } from '../data/site'
import styles from './ContactPage.module.css'
import { Heading } from '../components/heading/Heading'

/**
 * /contact — Milestone 9. The site's primary conversion page: a real,
 * validated enquiry form with no backend behind it yet (see
 * src/utils/contactSubmission.ts), and contact/service-area content built
 * entirely from src/data/site.ts. No invented phone number, WhatsApp
 * number, email address or office address — each direct-contact line
 * below renders only if the corresponding site.ts field is verified.
 */
export function ContactPage() {
  useDocumentMeta(buildContactSeo())

  const heroRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(heroRef, { y: 32 })

  const directRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(directRef, { y: 24 })

  const areaRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(areaRef, { y: 24 })

  const closingRef = useRef<HTMLParagraphElement>(null)
  useRevealOnScroll(closingRef, { y: 16 })

  const hasDirectContact = Boolean(site.phone || site.whatsappNumber || site.email)
  const whatsappUrl = site.whatsappNumber
    ? buildWhatsAppUrl(site.whatsappNumber, `Hi, I'd like to start a project with ${site.name}.`)
    : undefined

  return (
    <>
      {/* 01 — Start a project (hero + enquiry form, two columns on desktop) */}
      <section className={styles.hero} aria-labelledby="contact-hero-heading">
        <Container>
          <div ref={heroRef} className={styles.heroGrid}>
            <div className={styles.heroContext}>
              <Heading as="h1" id="contact-hero-heading" className={styles.heroHeading}>
                Start a project.
              </Heading>
              <p className={styles.heroSupporting}>
                Share the details of your villa, apartment or residential construction project below
                — we build across {formatList(site.serviceAreas)}.
              </p>
              <p className={styles.heroTrust}>
                {site.stats.yearsExperience} years of construction experience, guided by{' '}
                {formatList(site.values).toLowerCase()} at every stage.
              </p>
            </div>

            <div className={styles.formColumn}>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 02 — Direct contact / WhatsApp — only when a real value exists */}
      {hasDirectContact && (
        <section className={styles.section} aria-labelledby="contact-direct-heading">
          <Container>
            <div ref={directRef} className={styles.directInner}>
              <Heading as="h2" id="contact-direct-heading" className={styles.sectionHeading}>
                Prefer to talk directly?
              </Heading>
              <ul className={styles.directList}>
                {site.phones.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className={styles.directLink}>
                      Call {phone}
                    </a>
                  </li>
                ))}
                {whatsappUrl && (
                  <li>
                    <a
                      href={whatsappUrl}
                      className={styles.directLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Message us on WhatsApp
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className={styles.directLink}>
                      Email {site.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* 03 — Service area */}
      <section className={styles.section} aria-labelledby="contact-area-heading">
        <Container>
          <div ref={areaRef} className={styles.areaInner}>
            <Heading as="h2" id="contact-area-heading" className={styles.sectionHeading}>
              {formatList(site.serviceAreas)}.
            </Heading>
            <p className={styles.supporting}>
              {site.name} currently takes on villa, apartment and residential construction projects
              across {formatList(site.serviceAreas)}.
            </p>
          </div>
        </Container>
      </section>

      {/* Closing trust message — no repeated CTA button; this page is the CTA */}
      <section className={styles.closing} aria-label="Closing">
        <Container>
          <p ref={closingRef} className={styles.closingText}>
            {formatList(site.values)} — the same standard from first enquiry to final finish.
          </p>
        </Container>
      </section>
    </>
  )
}
