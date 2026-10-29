import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage — eagle hero', () => {
  function getHero(container: HTMLElement) {
    const hero = container.querySelector('section[aria-label="Visakram Builders"]') as HTMLElement
    expect(hero).not.toBeNull()
    return hero
  }

  it('renders the real headline, supporting copy and calls to action as text', () => {
    const { container } = renderHome()
    const hero = getHero(container)
    const heading = within(hero).getByRole('heading', {
      level: 1,
      name: 'Different Spaces. One Vision.',
    })
    expect(heading).toBeInTheDocument()
    expect(
      within(hero).getByText('Developing the Future of Living, Working & Connecting.'),
    ).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: 'Start a Project' })).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(within(hero).getByRole('link', { name: /see what we.re building/i })).toHaveAttribute(
      'href',
      '/projects',
    )
  })

  it('has a floating WhatsApp button that opens a chat with the first supplied number', () => {
    renderHome()
    const button = screen.getByRole('link', { name: /chat with visakram builders on whatsapp/i })
    expect(button.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/919515452875\?text=/)
    expect(button).toHaveAttribute('target', '_blank')
    expect(button).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('plays the flight clip over the still of the eagle on the roof, and hides the clip from assistive tech', () => {
    const { container } = renderHome()
    const hero = getHero(container)
    expect(within(hero).getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const still = within(hero).getByRole('img', {
      name: 'A white residential tower with the Visakram Builders sign, above a coastal city at sunrise',
    })
    expect(still).toHaveAttribute('src', '/assets/eagle-hero/hero-city.webp')
    const video = hero.querySelector('video') as HTMLVideoElement
    expect(video).not.toBeNull()
    expect(video.muted).toBe(true)
    expect(video.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(hero).toHaveAttribute('data-phase', 'flight')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('has an unmarked window on the big tower as the way in to the Home Tour, out of reach until the camera has settled', () => {
    const { container } = renderHome()
    const hero = getHero(container)
    const door = within(hero).getByRole('link', { name: /step inside/i, hidden: true })
    expect(door).toHaveAttribute('href', '#home-tour')
    // still in flight: not in the tab order yet
    expect(door).toHaveAttribute('tabindex', '-1')
  })

  it('draws the wordmark as decoration, one group per letter, waiting out of sight until the clip ends', () => {
    const { container } = renderHome()
    const hero = getHero(container)
    const wordmark = hero.querySelector('svg[aria-hidden="true"]')
    expect(wordmark).not.toBeNull()
    expect(wordmark?.querySelectorAll(':scope > g')).toHaveLength(8)
  })
})

describe('homepage — statement and proof', () => {
  it('renders the client-supplied statement and its supporting paragraph', () => {
    renderHome()
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Where Vision Shapes the Future.',
    })
    expect(heading).toBeInTheDocument()
    const statementSection = heading.closest('section')
    expect(statementSection).not.toBeNull()
    const scoped = within(statementSection as HTMLElement)
    expect(scoped.getByText(/forward thinking real estate development company/)).toBeInTheDocument()
    expect(
      scoped.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent?.includes('across Andhra Pradesh') === true,
      ),
    ).toBeInTheDocument()
  })

  it('shows only the verified stats, with no invented figures', () => {
    renderHome()
    const proof = screen.getByRole('region', { name: 'Visakram Builders in numbers' })
    expect(within(proof).getByText('15+')).toBeInTheDocument()
    expect(within(proof).getByText('40+')).toBeInTheDocument()
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

describe('homepage — eagle hero under reduced motion', () => {
  const original = window.matchMedia

  afterEach(() => {
    window.matchMedia = original
  })

  it('is the finished still: no clip, no camera pull-back, everything in place', () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    const { container } = renderHome()
    const hero = container.querySelector('section[aria-label="Visakram Builders"]') as HTMLElement
    expect(hero).toHaveAttribute('data-still', 'true')
    expect(hero).toHaveAttribute('data-phase', 'landed')
    expect(hero.querySelector('video')).toBeNull()
    expect(hero.querySelector('canvas')).toBeNull()
    // the window is an ordinary link, reachable at once
    expect(within(hero).getByRole('link', { name: /step inside/i })).toHaveAttribute(
      'tabindex',
      '0',
    )
    expect(
      within(hero).getByRole('img', {
        name: 'A white residential tower with the Visakram Builders sign, above a coastal city at sunrise',
      }),
    ).toBeInTheDocument()
  })
})
