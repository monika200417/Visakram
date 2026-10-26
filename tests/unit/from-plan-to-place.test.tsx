import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import {
  fromPlanToPlaceCaption,
  fromPlanToPlaceDisclaimer,
  fromPlanToPlaceStages,
  fromPlanToPlaceVideo,
} from '../../src/data/fromPlanToPlace'

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
  const heading = screen.getByRole('heading', { level: 2, name: 'Turning Land into Legacy.' })
  return heading.closest('section') as HTMLElement
}

describe('homepage — from plan to place', () => {
  it('renders the chapter with its heading and no numbered side label', () => {
    renderHome()
    const section = getSection()
    expect(within(section).queryByText('07 — From Scratch to Shape')).not.toBeInTheDocument()
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
    expect(fromPlanToPlaceDisclaimer.toLowerCase()).toContain('not a depiction of a specific')
  })

  it('opens with the supplied caption, exactly as written', () => {
    renderHome()
    const section = getSection()
    expect(fromPlanToPlaceCaption).toBe(
      'How raw blueprints transform into living spaces: an illustrative walkthrough of our delivery methodology.',
    )
    expect(within(section).getByText(fromPlanToPlaceCaption)).toBeInTheDocument()
  })

  it('shows the supplied walkthrough video, silent, looping, inline and control-free — never a 3D canvas', () => {
    renderHome()
    const section = getSection()
    expect(section.querySelector('canvas')).not.toBeInTheDocument()
    const video = section.querySelector('video') as HTMLVideoElement
    expect(video).not.toBeNull()
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('autoplay')
    expect(video).not.toHaveAttribute('controls')
    expect(video).toHaveAttribute('poster', fromPlanToPlaceVideo.poster)
    expect(video).toHaveAttribute('width', String(fromPlanToPlaceVideo.width))
    expect(video).toHaveAttribute('height', String(fromPlanToPlaceVideo.height))
    expect(video.closest('[role="img"]')).toHaveAttribute('aria-label', fromPlanToPlaceVideo.label)
  })

  it('does not download the video until the chapter is near the viewport', () => {
    renderHome()
    const section = getSection()
    // jsdom has no IntersectionObserver, so the chapter fails open and the video is allowed —
    // what matters here is that the file named is the supplied one and it is never preloaded.
    const video = section.querySelector('video') as HTMLVideoElement
    expect(video).toHaveAttribute('preload', 'none')
    const src = video.getAttribute('src')
    if (src) expect(src).toBe(fromPlanToPlaceVideo.src)
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

  it('follows the Visakram Way chapter and comes before Testimonials', () => {
    renderHome()
    const headings = screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent)
    const wayIndex = headings.indexOf('The Visakram Way')
    const planIndex = headings.indexOf('Turning Land into Legacy.')
    const testimonialsIndex = headings.indexOf('What our clients say.')
    expect(wayIndex).toBeGreaterThanOrEqual(0)
    expect(planIndex).toBeGreaterThan(wayIndex)
    expect(testimonialsIndex).toBeGreaterThan(planIndex)
  })
})
