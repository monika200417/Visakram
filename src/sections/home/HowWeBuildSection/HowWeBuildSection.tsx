import { useRef, type ReactNode } from 'react'
import { Container } from '../../../components/layout/Container'
import { processSteps } from '../../../data/process'
import { useProcessReveal } from './useProcessReveal'
import styles from './HowWeBuildSection.module.css'
import { Heading } from '../../../components/heading/Heading'

/** One line icon per approved step, in step order: consult, plan, build, quality, handover. */
const icons: readonly ReactNode[] = [
  // Consult — two speech bubbles
  <>
    <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    <path d="M19 9h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3h-4" />
  </>,
  // Plan — a set square and ruler over a sheet
  <>
    <path d="M4 20 4 4l16 16H4Z" />
    <path d="M8 20v-4M12 20v-2M4 12h3M4 8h2" />
    <path d="M14 4h6v6" />
  </>,
  // Build — a crane
  <>
    <path d="M6 22V6M6 6h14M6 6 2 11M6 6l8-4M20 6v5" />
    <path d="M17 11h6M20 11v4a1.5 1.5 0 1 1-3 0" />
    <path d="M3 22h6" />
  </>,
  // Quality — a shield with a tick
  <>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
    <path d="m8.5 12 2.5 2.5L16 9.5" />
  </>,
  // Handover — a key
  <>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9M16 7l3 3M14 9l2 2" />
  </>,
]

/** One picture per approved step, in step order (public/assets/process/README.md) (the top half of its card). */
const pictures: readonly { src: string; alt: string }[] = [
  {
    src: '/assets/process/consult.webp',
    alt: 'Three people standing around a plywood table on a construction site, studying a drawing together',
  },
  {
    src: '/assets/process/plan.webp',
    alt: 'Three colleagues in a site office going through floor plans, printed renders and a project timeline',
  },
  {
    src: '/assets/process/build.webp',
    alt: 'A site engineer pointing out a concrete column to two colleagues on a busy building site',
  },
  {
    src: '/assets/process/quality.webp',
    alt: 'Site engineers crouching to measure a reinforcement bar with a gauge and a checklist',
  },
  {
    src: '/assets/process/handover.webp',
    alt: 'A homeowner holding up a new set of keys, shaking hands with a site engineer in front of the finished apartments',
  },
]

/**
 * Chapter 08 — How We Build (its heading on the page reads "The Method Behind the Masterpiece.")
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §08). The five approved process steps
 * (src/data/process.ts) as premium cards of one size: the top half of each card is its picture, the bottom half
 * is the step's text, with a line icon on the seam and a red rule that draws across on hover. They arrive as a pile and are dealt out to both sides
 * (useProcessReveal); five across on desktop, a grid on tablet and a single column on mobile with
 * CSS alone. Each step is still real text in an ordered list.
 */
export function HowWeBuildSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useProcessReveal(sectionRef)

  return (
    <section
      id="how-we-build"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="how-we-build-heading"
    >
      <Container>
        <Heading as="h2" id="how-we-build-heading" className={styles.heading}>
          The Method Behind the Masterpiece.
        </Heading>

        <ol className={styles.steps}>
          {processSteps.map((step, i) => (
            <li key={step.title} className={styles.step} data-step>
              <div className={styles.card}>
                <div className={styles.media}>
                  <img
                    className={styles.photo}
                    src={pictures[i]?.src}
                    alt={pictures[i]?.alt ?? ''}
                    width={900}
                    height={605}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {icons[i]}
                  </svg>
                </span>
                <div className={styles.body}>
                  <span className={`text-mono-label ${styles.index}`}>{step.index}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
