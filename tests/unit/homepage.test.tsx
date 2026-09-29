import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { heroScenes } from '../../src/data/heroScenes'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage — cinematic hero', () => {
  it('renders the real headline, supporting copy and primary CTA as text, not just inside decorative markup', () => {
    renderHome()
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Places that hold their ground.',
    })
    expect(heading).toBeInTheDocument()
    const heroSection = heading.closest('section')
    expect(heroSection).not.toBeNull()
    expect(
      within(heroSection as HTMLElement).getByRole('link', { name: 'Start a Project' }),
    ).toHaveAttribute('href', '/contact')
  })

  it('does not fabricate a WhatsApp destination while the number is unverified', () => {
    renderHome()
    expect(screen.queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument()
    expect(screen.getByText(/whatsapp.*pending client confirmation/i)).toBeInTheDocument()
  })

  it('marks every hero scene as a development placeholder (auditable before launch)', () => {
    renderHome()
    for (const scene of heroScenes) {
      expect(screen.getByText(new RegExp(scene.title, 'i'))).toBeInTheDocument()
    }
    const { container } = renderHome()
    expect(container.querySelectorAll('[data-dev-placeholder]').length).toBeGreaterThanOrEqual(
      heroScenes.length,
    )
  })

  it('hides the decorative visual stage from assistive tech', () => {
    const { container } = renderHome()
    const stage = container.querySelector('[aria-hidden="true"]')
    expect(stage).not.toBeNull()
  })

  it('provides an accessible "Explore" link to the statement chapter', () => {
    renderHome()
    const explore = screen.getByRole('link', { name: 'Explore' })
    expect(explore).toHaveAttribute('href', '#statement')
  })
})

describe('homepage — statement and proof', () => {
  it('renders the statement using only verified business facts', () => {
    renderHome()
    const heading = screen.getByRole('heading', {
      level: 2,
      name: /turn plans, materials and construction expertise/i,
    })
    expect(heading).toBeInTheDocument()
    const statementSection = heading.closest('section')
    expect(statementSection).not.toBeNull()
    const scoped = within(statementSection as HTMLElement)
    expect(scoped.getByText(/Kommadi, Visakhapatnam/)).toBeInTheDocument()
    expect(scoped.getByText(/Visakhapatnam and Vizianagaram/)).toBeInTheDocument()
  })

  it('shows only the verified stats, with no invented figures', () => {
    renderHome()
    const proof = screen.getByRole('region', { name: 'Visakram Builders in numbers' })
    expect(within(proof).getByText('20+')).toBeInTheDocument()
    expect(within(proof).getByText('25+')).toBeInTheDocument()
    expect(within(proof).getByText('5')).toBeInTheDocument()
    expect(within(proof).getByText('Years of experience')).toBeInTheDocument()
    expect(within(proof).getByText('Completed projects')).toBeInTheDocument()
    expect(within(proof).getByText('Ongoing projects')).toBeInTheDocument()
  })

  it('keeps a logical heading outline on the homepage (one h1, no skipped levels)', () => {
    // Milestone 4 adds genuinely nested content (category names, principles,
    // process steps) as h3s under their section's own h2 — so the ceiling
    // is no longer a hardcoded 2. What must still hold: exactly one h1, and
    // no jump from one level straight to a deeper one without passing
    // through the level in between.
    renderHome()
    const headings = screen.getAllByRole('heading').map((el) => Number(el.tagName[1]))
    expect(headings[0]).toBe(1)
    expect(headings.filter((level) => level === 1)).toHaveLength(1)
    let deepestSeen = 1
    for (const level of headings) {
      expect(level).toBeLessThanOrEqual(deepestSeen + 1)
      deepestSeen = Math.max(deepestSeen, level)
    }
  })
})
