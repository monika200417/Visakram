import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import {
  homeTourFilm,
  homeTourFilmChapters,
  homeTourFilmDisclaimer,
} from '../../src/data/homeTourFilm'
import { homeTourChapterCopy } from '../../src/sections/home/HomeTourVideoSection/chapterCopy'
import { HomeTourVideoSection } from '../../src/sections/home/HomeTourVideoSection/HomeTourVideoSection'

/**
 * jsdom has no media pipeline, no IntersectionObserver and no real
 * matchMedia, so each is stood in for here. What this verifies is the
 * section's own contract — what is on the page, when the film is allowed to
 * download, and that reduced motion gets a still — not the scroll mapping
 * itself, which is covered by home-tour-film-data.test.ts and was measured in
 * a real browser.
 */
type Entry = { isIntersecting: boolean }
let observers: Array<{ margin: string; callback: (entries: Entry[]) => void }> = []

class FakeIntersectionObserver {
  constructor(callback: (entries: Entry[]) => void, options?: { rootMargin?: string }) {
    observers.push({ margin: options?.rootMargin ?? '0px', callback })
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// The section watches two margins: a near one (to attach the film) and a far one (to release it).
const ENTER = '120% 0px'
const LEAVE = '400% 0px'

function trigger(margin: string, isIntersecting: boolean) {
  act(() => {
    observers.filter((o) => o.margin === margin).forEach((o) => o.callback([{ isIntersecting }]))
  })
}
const setNear = (isIntersecting: boolean) => trigger(isIntersecting ? ENTER : LEAVE, isIntersecting)

function mockReducedMotion(reduce: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

function getVideo(container: HTMLElement) {
  const video = container.querySelector('video')
  expect(video).not.toBeNull()
  return video as HTMLVideoElement
}

describe('Home Tour video section', () => {
  let restoreMatchMedia: (() => void) | undefined

  beforeEach(() => {
    observers = []
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    // jsdom does not implement media playback
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    restoreMatchMedia?.()
    restoreMatchMedia = undefined
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('has a meaningful section heading, the tagline and the required illustrative disclaimer', () => {
    render(<HomeTourVideoSection />)
    const section = document.getElementById('home-tour') as HTMLElement
    expect(section).toHaveAttribute('aria-labelledby', 'home-tour-heading')
    expect(
      within(section).getByRole('heading', { level: 2, name: 'Home Tour.' }),
    ).toBeInTheDocument()
    expect(within(section).getByText('Experience spaces beyond walls.')).toBeInTheDocument()
    expect(within(section).getByText(homeTourFilmDisclaimer)).toBeInTheDocument()
  })

  it('lists all eight chapters as real text, in film order — and nothing beyond the film', () => {
    const { container } = render(<HomeTourVideoSection />)
    const items = Array.from(container.querySelectorAll('[data-chapter]'))
    expect(items).toHaveLength(homeTourFilmChapters.length)
    homeTourFilmChapters.forEach((chapter, i) => {
      // the title reads as one phrase even where it is set in two tones
      expect(items[i]!.textContent).toContain(chapter.title)
      if (chapter.solo) expect(items[i]!.textContent).not.toContain(chapter.index)
      else expect(items[i]!.textContent).toContain(chapter.index)
    })
  })

  it('sets the last chapter as its statement alone, in two tones, with the supporting line and rule left out', () => {
    const { container } = render(<HomeTourVideoSection />)
    const last = Array.from(container.querySelectorAll<HTMLElement>('[data-chapter]')).at(-1)!
    expect(last).toHaveAttribute('data-solo', 'true')
    expect(last.textContent).toBe('Brick by Brick We Build Trust')
    expect(last.querySelectorAll('span[class*=titleAccent]')).toHaveLength(1)
    expect(last.querySelector('span[class*=titleAccent]')!.textContent).toBe('Brick by Brick')
    expect(last.querySelector('span[class*=titleWhite]')!.textContent).toBe('We Build Trust')
    expect(last.querySelector('span[class*=support]')).toBeNull()
    expect(last.querySelector('span[class*=baseline]')).toBeNull()
  })

  it('gives every chapter but the last its supporting line and a gold baseline, and no longer renders a progress rail', () => {
    const { container } = render(<HomeTourVideoSection />)
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-chapter]'))
    const withCopy = homeTourFilmChapters.filter((chapter) => !chapter.solo)
    homeTourFilmChapters.forEach((chapter, i) => {
      if (!chapter.solo) expect(items[i]!.textContent).toContain(homeTourChapterCopy[chapter.id])
    })
    expect(Object.keys(homeTourChapterCopy)).toHaveLength(withCopy.length)
    expect(container.querySelectorAll('[data-tick]')).toHaveLength(0)
  })

  it('starts on the first chapter, with the other seven hidden from assistive tech', () => {
    const { container } = render(<HomeTourVideoSection />)
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-chapter]'))
    expect(items[0]).toHaveAttribute('data-active', 'true')
    expect(items[0]).not.toHaveAttribute('aria-hidden')
    for (const item of items.slice(1)) expect(item).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not download the film until the section is near the viewport', () => {
    const { container } = render(<HomeTourVideoSection />)
    const video = getVideo(container)
    expect(video).not.toHaveAttribute('src')
    expect(video).toHaveAttribute('preload', 'none')
    // the poster (the film's own first frame) is what shows meanwhile
    expect(video).toHaveAttribute('poster', homeTourFilm.poster)

    setNear(true)
    expect(video).toHaveAttribute('src', homeTourFilm.src)
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalled()
  })

  it('releases the film again when the visitor scrolls far away', () => {
    const { container } = render(<HomeTourVideoSection />)
    const video = getVideo(container)
    setNear(true)
    expect(video).toHaveAttribute('src')

    setNear(false)
    expect(video).not.toHaveAttribute('src')
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it('does not release the film when a quick scroll merely overshoots the section', () => {
    const { container } = render(<HomeTourVideoSection />)
    const video = getVideo(container)
    setNear(true)
    expect(video).toHaveAttribute('src')

    // outside the near margin, but still inside the far one: the film stays loaded
    trigger(ENTER, false)
    expect(video).toHaveAttribute('src', homeTourFilm.src)

    // only well beyond the far margin is it released
    trigger(LEAVE, false)
    expect(video).not.toHaveAttribute('src')
  })

  it('keeps the video muted, inline, control-free and never autoplaying — scroll is the only thing that moves it', () => {
    const { container } = render(<HomeTourVideoSection />)
    const video = getVideo(container)
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('playsinline')
    expect(video).not.toHaveAttribute('controls')
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).not.toHaveAttribute('loop')
    expect(video).toHaveAttribute('tabindex', '-1')
  })

  it('reserves the film 16:9 frame at its real dimensions, so nothing shifts while it loads', () => {
    const { container } = render(<HomeTourVideoSection />)
    const video = getVideo(container)
    expect(video).toHaveAttribute('width', String(homeTourFilm.width))
    expect(video).toHaveAttribute('height', String(homeTourFilm.height))
    expect(video.closest('[role="img"]')).toHaveAttribute('aria-label', homeTourFilm.alt)
  })

  it('under reduced motion shows the still and the full chapter list, and never downloads the film', () => {
    restoreMatchMedia = mockReducedMotion(true)
    const { container } = render(<HomeTourVideoSection />)
    const section = document.getElementById('home-tour') as HTMLElement
    expect(section).toHaveAttribute('data-mode', 'still')

    setNear(true)
    const video = getVideo(container)
    expect(video).not.toHaveAttribute('src')
    expect(video).toHaveAttribute('poster', homeTourFilm.poster)

    // every chapter is plainly readable: none hidden, none stacked behind another
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-chapter]'))
    expect(items).toHaveLength(homeTourFilmChapters.length)
    for (const item of items) {
      expect(item).not.toHaveAttribute('aria-hidden')
      expect(item).not.toHaveAttribute('data-active')
    }
  })

  it('is in film mode when motion is welcome', () => {
    restoreMatchMedia = mockReducedMotion(false)
    render(<HomeTourVideoSection />)
    expect(document.getElementById('home-tour')).toHaveAttribute('data-mode', 'film')
  })
})

describe('Home Tour video section on the Home page', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('is the second page of the homepage: it follows the eagle hero directly, ahead of How We Build', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    const ids = Array.from(document.querySelectorAll('main > section[id]')).map((el) => el.id)
    const tour = ids.indexOf('home-tour')
    // the hero is the first thing in main; the tour is the very next section
    expect(tour).toBe(0)
    expect(
      document.querySelector('main')?.firstElementChild?.querySelector('section'),
    ).toHaveAttribute('aria-label', 'Visakram Builders')
    expect(ids[tour + 1]).toBe('how-we-build')
    expect(ids[tour + 2]).toBe('statement')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
