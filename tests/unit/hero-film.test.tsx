import { render as rtlRender } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { heroFilm } from '../../src/data/heroFilm'
import { CinematicHero } from '../../src/sections/home/CinematicHero/CinematicHero'

/**
 * jsdom has no media pipeline, canvas or image decoding, so fetch, the decoder
 * and the canvas are stood in for. What this verifies is the hero's own
 * contract — where the frame sequence is allowed to load (wide screens with
 * motion welcome, and nowhere else), and that the poster is always the picture
 * to fall back on — not the scroll mapping itself, which is covered by
 * hero-film-data.test.ts and was measured in a real browser.
 */
const render = (ui: React.ReactElement) => rtlRender(<MemoryRouter>{ui}</MemoryRouter>)

const originalMatchMedia = window.matchMedia

function setEnvironment({ wide, reduced }: { wide: boolean; reduced: boolean }) {
  window.matchMedia = ((query: string) => {
    const asksWide = query.includes('min-width')
    const asksNoPreference = query.includes('no-preference')
    const asksReduce = query.includes('prefers-reduced-motion: reduce')
    let matches = true
    if (asksWide) matches = matches && wide
    if (asksNoPreference) matches = matches && !reduced
    if (asksReduce) matches = matches && reduced
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }
  }) as unknown as typeof window.matchMedia
}

const frameRequests = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls
    .map(([url]) => String(url))
    .filter((url) => url.startsWith(heroFilm.basePath))

let fetchMock: ReturnType<typeof vi.fn>
const settle = () => new Promise((resolve) => setTimeout(resolve, 400))

beforeEach(() => {
  fetchMock = vi.fn(() => new Promise(() => {})) // never resolves: only the requests matter
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('createImageBitmap', vi.fn())
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('hero frame sequence loading', () => {
  it('on a wide screen with motion welcome, requests frames only after the first render, keyframes first', async () => {
    setEnvironment({ wide: true, reduced: false })
    const { container } = render(<CinematicHero />)
    // nothing is requested during the render itself — the poster alone is the initial hero
    expect(frameRequests(fetchMock)).toHaveLength(0)

    await vi.waitFor(() => expect(frameRequests(fetchMock).length).toBeGreaterThan(0))
    const first = frameRequests(fetchMock).slice(0, 4)
    expect(first).toEqual(
      [0, 6, 12, 18].map((i) => `${heroFilm.basePath}/f_00${String(i + 1).padStart(2, '0')}.webp`),
    )
    expect(container.querySelector('section')).toHaveAttribute('data-hero-film', 'on')
    // the poster is still there as the fallback
    expect(container.querySelector('img')).not.toBeNull()
  })

  it('on a narrow screen never requests a frame', async () => {
    setEnvironment({ wide: false, reduced: false })
    const { container } = render(<CinematicHero />)
    await settle()
    expect(frameRequests(fetchMock)).toHaveLength(0)
    expect(container.querySelector('section')).not.toHaveAttribute('data-hero-film')
    expect(container.querySelector('img')).not.toBeNull()
  })

  it('under reduced motion never requests a frame: the poster stays', async () => {
    setEnvironment({ wide: true, reduced: true })
    const { container } = render(<CinematicHero />)
    await settle()
    expect(frameRequests(fetchMock)).toHaveLength(0)
    expect(container.querySelector('section')).not.toHaveAttribute('data-hero-film')
  })

  it('with data-saver on never requests a frame', async () => {
    setEnvironment({ wide: true, reduced: false })
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
    })
    try {
      render(<CinematicHero />)
      await settle()
      expect(frameRequests(fetchMock)).toHaveLength(0)
    } finally {
      delete (navigator as unknown as Record<string, unknown>).connection
    }
  })

  it('stops loading when the hero unmounts', async () => {
    setEnvironment({ wide: true, reduced: false })
    const { unmount } = render(<CinematicHero />)
    await vi.waitFor(() => expect(frameRequests(fetchMock).length).toBeGreaterThan(0))
    const signals = fetchMock.mock.calls.map(
      ([, init]) => (init as RequestInit).signal as AbortSignal,
    )
    unmount()
    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })
})
