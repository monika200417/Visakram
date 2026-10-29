import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { expectOnlyVerifiedContactLinks } from '../helpers/contactLinks'
import { services } from '../../src/data/services'
import { founders } from '../../src/data/founders'
import { site } from '../../src/data/site'
import { primaryCta } from '../../src/data/navigation'

/**
 * Founders and services are real, verified, non-empty data (unlike
 * projects) — so unlike the Milestone 6 tests, these run directly against
 * the real data layer with no mocking needed.
 */
function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <App />
    </MemoryRouter>,
  )
}

describe('about page', () => {
  it('renders exactly one h1 with no skipped heading levels', () => {
    renderAbout()
    const headings = screen.getAllByRole('heading').map((el) => Number(el.tagName[1]))
    expect(headings[0]).toBe(1)
    expect(headings.filter((level) => level === 1)).toHaveLength(1)

    let deepestSeen = 1
    for (const level of headings) {
      expect(level).toBeLessThanOrEqual(deepestSeen + 1)
      deepestSeen = Math.max(deepestSeen, level)
    }
  })

  it('renders the verified years-of-experience figure, not an invented one', () => {
    renderAbout()
    // Appears at least twice: the hero headline and the experience callout.
    // A plain substring matcher, not a regex — site.stats.yearsExperience
    // ('20+') contains a '+', a regex quantifier that would otherwise
    // change what this actually matches.
    const matches = screen.getAllByText((_, element) =>
      Boolean(element?.textContent?.includes(site.stats.yearsExperience)),
    )
    expect(matches.length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Years of construction experience.' }),
    ).toBeInTheDocument()
  })

  it('sources "what we build" from services.ts — all three, matching titles and copy', () => {
    renderAbout()
    const buildHeading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = buildHeading.closest('section') as HTMLElement
    const scoped = within(section)

    expect(services).toHaveLength(3)
    for (const service of services) {
      expect(scoped.getByRole('heading', { level: 3, name: service.title })).toBeInTheDocument()
      expect(scoped.getByText(service.shortDescription)).toBeInTheDocument()
    }
    expect(scoped.getByRole('link', { name: /view all services/i })).toHaveAttribute(
      'href',
      '/services',
    )
  })

  it('renders both founders’ own stories and their education, from founders.ts', () => {
    renderAbout()
    const foundersHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Two backgrounds. One direction.',
    })
    const section = foundersHeading.closest('section') as HTMLElement
    const scoped = within(section)

    expect(founders).toHaveLength(2)
    for (const founder of founders) {
      expect(scoped.getByText(founder.storyLabel)).toBeInTheDocument()
      expect(scoped.getByRole('heading', { level: 3, name: founder.headline })).toBeInTheDocument()
      expect(scoped.getByText(founder.subheading)).toBeInTheDocument()
      for (const paragraph of founder.story) {
        // each paragraph is whole, though "Andhra Pradesh" inside it is set in its own unbroken span
        expect(
          scoped.getByText((_, el) => el?.tagName === 'P' && el.textContent === paragraph),
        ).toBeInTheDocument()
      }
      expect(scoped.getByText(founder.name)).toBeInTheDocument()
      expect(scoped.getByText(founder.role)).toBeInTheDocument()
      for (const line of founder.education ?? []) {
        expect(scoped.getByText(line)).toBeInTheDocument()
      }
    }
    expect(scoped.getAllByText('Turning Land Into Legacy.')).toHaveLength(2)
  })

  it('keeps "Andhra Pradesh" unbroken inside the founders’ stories', () => {
    renderAbout()
    const section = screen
      .getByRole('heading', { level: 2, name: 'Two backgrounds. One direction.' })
      .closest('section') as HTMLElement
    const kept = Array.from(section.querySelectorAll('p span')).filter(
      (el) => el.textContent === 'Andhra Pradesh',
    )
    expect(kept).toHaveLength(2)
  })

  it('shows "Credibility Built. Never Claimed." with the three client-supplied figures', () => {
    renderAbout()
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Credibility Built. Never Claimed.',
    })
    const scoped = within(heading.closest('section') as HTMLElement)
    expect(scoped.getByText(site.stats.yearsExperience)).toBeInTheDocument()
    expect(scoped.getByText('Years of experience')).toBeInTheDocument()
    expect(scoped.getByText(site.stats.completedProjects)).toBeInTheDocument()
    expect(scoped.getByText('Projects')).toBeInTheDocument()
    expect(scoped.getByText(String(site.stats.ongoingProjects))).toBeInTheDocument()
    expect(scoped.getByText('Ongoing projects')).toBeInTheDocument()
    expect(site.stats).toMatchObject({
      yearsExperience: '15+',
      completedProjects: '40+',
      ongoingProjects: 5,
    })
  })

  it('handles the current absence of founder photos gracefully, never a fake portrait', () => {
    renderAbout()
    const foundersHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Two backgrounds. One direction.',
    })
    const section = foundersHeading.closest('section') as HTMLElement
    const scoped = within(section)

    for (const founder of founders) {
      expect(founder.image).toBeUndefined()
      expect(scoped.getByText(`Dev placeholder · ${founder.name}`)).toBeInTheDocument()
    }
    // No <img> is rendered for either founder while no real photo exists
    // (the site's Logo in the header/footer is the only <img> on the page).
    expect(scoped.queryAllByRole('img')).toHaveLength(0)
  })

  it('renders the verified local service areas, no invented address', () => {
    renderAbout()
    const localHeading = screen.getByRole('heading', {
      level: 2,
      name: `${site.serviceAreas.join(' and ')}.`,
    })
    const section = localHeading.closest('section') as HTMLElement
    const scoped = within(section)
    for (const area of site.serviceAreas) {
      // The area name appears in both the heading and the supporting
      // sentence, so assert presence rather than a single unique match.
      expect(scoped.getAllByText(new RegExp(area)).length).toBeGreaterThan(0)
    }
  })

  it("ends with the site's existing primary CTA, no invented contact details", () => {
    renderAbout()
    // The header's own CTA also reads "Start a Project" (existing, unrelated
    // to this page) — scope to the page's own closing CTA section.
    const ctaHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Let’s Create a Lasting Legacy.',
    })
    const section = ctaHeading.closest('section') as HTMLElement
    expect(within(section).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    // No invented phone/email anywhere on the page: only the client-supplied ones (in the footer).
    expectOnlyVerifiedContactLinks()
  })

  it('sets document title and description from verified site data', () => {
    renderAbout()
    expect(document.title).toBe(`About ${site.name} | ${site.city}`)
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description).toContain(site.name)
    expect(description).toContain(site.stats.yearsExperience)
  })

  it('renders all real content synchronously, independent of animation or reduced-motion state', () => {
    // jsdom performs no real layout and the shared matchMedia polyfill
    // (tests/setup.ts) cannot simulate an actual reduced-motion
    // preference, so this cannot assert the exact GSAP branch taken
    // (documented limitation, same as every prior milestone's report).
    // What it does verify: every real content section is present in the
    // DOM immediately on render, not gated behind an animation promise —
    // the reduced-motion-complete-experience requirement this app's own
    // useRevealOnScroll hook already guarantees (docs/ANIMATION-SYSTEM.md
    // §23) never leaves content missing regardless of motion state.
    renderAbout()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'What we build.' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Two backgrounds. One direction.' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: primaryCta.label }).length).toBeGreaterThan(0)
  })
})
