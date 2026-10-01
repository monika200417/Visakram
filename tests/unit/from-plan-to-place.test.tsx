import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { fromPlanToPlaceStages, fromPlanToPlaceDisclaimer } from '../../src/data/fromPlanToPlace'

/**
 * jsdom has no real WebGL and the shared `matchMedia` polyfill
 * (tests/setup.ts) always reports `matches: false` for every query — so
 * in this environment FromPlanToPlaceSection's canvas-eligibility check
 * is always false and it always renders the static HTML/CSS fallback.
 * That is exactly the "reduced motion / mobile / no WebGL" code path
 * (they all render the same fallback), so this file exercises it for
 * real rather than mocking it. See from-plan-to-place-eligible.test.tsx
 * for the (mocked) desktop-canvas-eligible path.
 */
function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function getSection() {
  const heading = screen.getByRole('heading', { level: 2, name: 'From plan to place.' })
  return heading.closest('section') as HTMLElement
}

describe('homepage — from plan to place', () => {
  it('renders the chapter with its eyebrow and heading', () => {
    renderHome()
    const section = getSection()
    expect(within(section).getByText('07 — From Plan to Place')).toBeInTheDocument()
  })

  it('renders all six stages, sourced from data, in order', () => {
    renderHome()
    const section = getSection()
    const scoped = within(section)

    expect(fromPlanToPlaceStages).toHaveLength(6)
    const itemHeadings = scoped.getAllByRole('heading', { level: 3 })
    expect(itemHeadings.map((el) => el.textContent)).toEqual(
      fromPlanToPlaceStages.map((stage) => stage.title),
    )
    for (const stage of fromPlanToPlaceStages) {
      expect(scoped.getByText(stage.index)).toBeInTheDocument()
      expect(scoped.getByText(stage.description)).toBeInTheDocument()
    }
  })

  it('never implies this is a real Visakram project — the disclaimer is always shown', () => {
    renderHome()
    const section = getSection()
    expect(within(section).getByText(fromPlanToPlaceDisclaimer)).toBeInTheDocument()
    expect(fromPlanToPlaceDisclaimer.toLowerCase()).toContain('not a rendering of a specific')
  })

  it('renders the static HTML/CSS fallback visual, never a blank canvas, when canvas is not eligible', () => {
    renderHome()
    const section = getSection()
    // No <canvas> — jsdom's matchMedia stub always reports "not desktop /
    // reduced motion", so the static fallback (six CSS-only glyphs) is
    // what actually renders here, exactly like the real reduced-motion,
    // mobile and no-WebGL cases.
    expect(section.querySelector('canvas')).not.toBeInTheDocument()
    expect(section.querySelectorAll('[aria-hidden="true"] > div').length).toBeGreaterThanOrEqual(6)
  })

  it('keeps a logical heading structure inside the chapter (h2 then h3s only)', () => {
    renderHome()
    const section = getSection()
    const headings = within(section)
      .getAllByRole('heading')
      .map((el) => Number(el.tagName[1]))
    expect(headings[0]).toBe(2)
    expect(headings.slice(1).every((level) => level === 3)).toBe(true)
  })

  it('does not disturb the homepage-wide single h1', () => {
    renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('sits between the Visakram Way and How We Build chapters', () => {
    renderHome()
    const headings = screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent)
    const wayIndex = headings.indexOf('The Visakram Way')
    const planIndex = headings.indexOf('From plan to place.')
    const buildIndex = headings.indexOf('How we build.')
    expect(wayIndex).toBeGreaterThanOrEqual(0)
    expect(planIndex).toBeGreaterThan(wayIndex)
    expect(buildIndex).toBeGreaterThan(planIndex)
  })
})
