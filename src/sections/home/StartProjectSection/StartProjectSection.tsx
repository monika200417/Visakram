import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/buttons/Button'
import { Container } from '../../../components/layout/Container'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { primaryCta } from '../../../data/navigation'
import { site } from '../../../data/site'
import { buildWhatsAppUrl } from '../../../utils/buildWhatsAppUrl'
import { telHref } from '../../../utils/telHref'
import { formatList } from '../../../utils/formatList'
import styles from './StartProjectSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/**
 * Chapter 13 — Start a Project
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 13). A
 * transition into the existing /contact experience, not a second copy of its
 * form: the site's own primary CTA does the converting. The blueprint's
 * direct channels — WhatsApp and Call — appear alongside it only once
 * site.whatsappNumber / site.phone are verified; until then nothing is shown
 * in their place (no placeholder, no dead link), exactly as /contact behaves.
 * No response time, price, budget or availability claim is made.
 */
export function StartProjectSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  // The same fixed, non-personal prefill /contact uses (src/pages/ContactPage.tsx).
  const whatsappUrl = site.whatsappNumber
    ? buildWhatsAppUrl(site.whatsappNumber, `Hi, I'd like to start a project with ${site.name}.`)
    : undefined
  const hasDirectChannel = Boolean(site.phone || whatsappUrl)

  return (
    <section
      id="start-a-project"
      className={styles.section}
      aria-labelledby="start-a-project-heading"
    >
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <div className={styles.lead}>
            <Heading as="h2" id="start-a-project-heading" className={styles.heading}>
              Start your project.
            </Heading>
            <p className={styles.supporting}>
              Share the details of your villa, apartment or residential construction project — we
              build across {formatList(site.serviceAreas)}.
            </p>
            <div className={styles.cta}>
              <Button to={primaryCta.to} variant="primary">
                {primaryCta.label}
              </Button>
            </div>
          </div>

          {hasDirectChannel ? (
            <ul className={styles.channels} aria-label="Contact choices">
              <li className={styles.channel}>
                <Link to={primaryCta.to} className={styles.channelLink}>
                  <span className={styles.channelLabel}>Enquiry form</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
              {whatsappUrl ? (
                <li className={styles.channel}>
                  <a
                    href={whatsappUrl}
                    className={styles.channelLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className={styles.channelLabel}>WhatsApp</span>
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ) : null}
              {site.phone ? (
                <li className={styles.channel}>
                  <a href={telHref(site.phone)} className={styles.channelLink}>
                    <span className={styles.channelLabel}>Call {site.phone}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
