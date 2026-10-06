import { render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { homeTourSequence } from '../../src/media/home-tour/manifest'

/**
 * The Home Tour section, tested at the React boundary. The film is plain
 * video, so nothing needs mocking: in jsdom the clips simply never load, which
 * is also what a failed download looks like to the component.
 */
const originalMatchMedia = window.matchMedia

function stubMatchMedia(desktop: boolean, motionOk: boolean) {
  window.matchMedia = ((query: string) => {
    const matches =
      (query.includes('min-width: 1024px') && desktop) ||
      (query.includes('no-preference') && motionOk)
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList
  }) as typeof window.matchMedia
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

async function renderSection() {
  const { HomeTourSection } =
    await import('../../src/sections/home/HomeTourSection/HomeTourSection')
  return render(<HomeTourSection />)
}

function expectStaticBlock() {
  const section = document.querySelector('#home-tour') as HTMLElement
  expect(section.getAttribute('data-mode')).toBe('static')
  const scoped = within(section)
  expect(scoped.getByRole('heading', { level: 2, name: 'Home Tour' })).toBeInTheDocument()
  expect(scoped.getByText('Experience spaces beyond walls.')).toBeInTheDocument()
  expect(scoped.getByText(/illustrative residence/i)).toBeInTheDocument()
  expect(scoped.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
    homeTourSequence.map((c) => c.title),
  )
  for (const c of homeTourSequence) expect(scoped.getByText(c.caption)).toBeInTheDocument()
  // Stills only: no film is requested, nothing is pinned
  expect(section.querySelector('video')).toBeNull()
  expect(section.querySelector('[data-home-tour-media]')).toBeNull()
  const images = Array.from(section.querySelectorAll('img'))
  expect(images.map((i) => i.getAttribute('src'))).toEqual(homeTourSequence.map((c) => c.poster))
  expect(images.every((i) => i.getAttribute('loading') === 'lazy')).toBe(true)
}

describe('Home Tour section — static fallback', () => {
  it('mobile / tablet: the title, a still and a caption per chapter, and no video', async () => {
    stubMatchMedia(false, true)
    await renderSection()
    expectStaticBlock()
  })

  it('reduced motion: stills only, even on a desktop', async () => {
    stubMatchMedia(true, false)
    await renderSection()
    expectStaticBlock()
  })

  it('data-saver: stills only, even on a desktop with motion allowed', async () => {
    stubMatchMedia(true, true)
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    })
    try {
      await renderSection()
      expectStaticBlock()
    } finally {
      Reflect.deleteProperty(navigator, 'connection')
    }
  })

  it('keeps the unbranded residence free of signage', async () => {
    stubMatchMedia(false, true)
    await renderSection()
    const section = document.querySelector('#home-tour') as HTMLElement
    const visible = Array.from(section.querySelectorAll('h2, h3, p')).map((el) => el.textContent)
    // The only mention of the company is the disclaimer saying this is not one of its projects.
    expect(visible.filter((t) => /visakram/i.test(t ?? ''))).toHaveLength(1)
  })
})

describe('Home Tour section — the pinned film (desktop, motion ok)', () => {
  beforeEach(() => stubMatchMedia(true, true))

  it('switches to the pinned tour and renders the media layer', async () => {
    await renderSection()
    const section = document.querySelector('#home-tour') as HTMLElement
    expect(section.getAttribute('data-mode')).toBe('tour')
    expect(section.querySelector('[data-home-tour-media]')).not.toBeNull()
  })

  it('shows the first still and a muted clip, and requests only the current and next clips', async () => {
    await renderSection()
    const section = document.querySelector('#home-tour') as HTMLElement
    const first = homeTourSequence[0]!
    expect(section.querySelector(`img[src="${first.poster}"]`)).not.toBeNull()
    const videos = Array.from(section.querySelectorAll('video'))
    expect(videos.length).toBeGreaterThan(0)
    expect(videos.length).toBeLessThanOrEqual(3)
    for (const v of videos) expect(v.muted).toBe(true)
  })

  it('carries every chapter as text over the film (never replaced by it), with a journey station each', async () => {
    await renderSection()
    const section = document.querySelector('#home-tour') as HTMLElement
    expect(within(section).getAllByRole('heading', { level: 3, hidden: true })).toHaveLength(
      homeTourSequence.length,
    )
    expect(section.querySelectorAll('[data-tour-node]')).toHaveLength(homeTourSequence.length)
    expect(section.querySelector('[data-tour-chapters]')).not.toBeNull()
  })

  it('has no player chrome: no controls, no play button, no autoplay', async () => {
    await renderSection()
    const section = document.querySelector('#home-tour') as HTMLElement
    for (const v of Array.from(section.querySelectorAll('video'))) {
      expect(v.hasAttribute('controls')).toBe(false)
      expect(v.hasAttribute('autoplay')).toBe(false)
    }
    expect(within(section).queryByRole('button')).toBeNull()
  })
})
