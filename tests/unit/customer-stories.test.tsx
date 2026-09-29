import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'

/**
 * Real, currently-empty `testimonials` collection (src/data/testimonials.ts)
 * — no mocking here. See customer-stories-populated.test.tsx for the
 * architecture once a real testimonial exists.
 */
function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage customer stories — real (currently empty) collection', () => {
  it('renders the section heading but no testimonial card', () => {
    renderHome()

    const heading = screen.getByRole('heading', { level: 2, name: 'Customer stories.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)

    // No fabricated quote, name, rating or figure — the empty collection
    // renders nothing that looks like a testimonial. Queried directly on
    // the DOM node (not via ARIA role) since <blockquote>/<figure> role
    // support varies across testing-library/jsdom versions.
    expect(section.querySelectorAll('blockquote')).toHaveLength(0)
    expect(section.querySelectorAll('figure')).toHaveLength(0)
    expect(scoped.queryAllByRole('img')).toHaveLength(0)
  })

  it('shows a polished, non-dominant empty state instead of a broken carousel', () => {
    renderHome()

    const heading = screen.getByRole('heading', { level: 2, name: 'Customer stories.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)

    const empty = scoped.getByText(/awaiting approved customer stories/i)
    expect(empty).toHaveAttribute('data-dev-placeholder')
    // The visible copy itself never says "dev" or "placeholder" — it reads
    // like a normal, finished sentence to an actual visitor.
    expect(empty.textContent?.toLowerCase()).not.toMatch(/\bdev\b|placeholder/)
  })

  it('does not break the homepage heading outline (one h1, no skipped levels)', () => {
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
