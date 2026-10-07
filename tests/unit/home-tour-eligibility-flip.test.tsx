import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadGsap } from '../../src/animations/gsap'
import { HomePage } from '../../src/pages/HomePage'

/**
 * Regression: the Home Tour used to blank the whole page when its eligibility
 * flipped while mounted (the viewport crossing 1024px, a tablet rotating, the
 * reduced-motion preference changing). GSAP wraps the pinned panel in a
 * `.pin-spacer`, so React's attempt to remove the panel itself from the
 * section threw `NotFoundError: removeChild`, which unmounted the entire app.
 * The pinned branch now sits inside a React-owned wrapper, so React removes the
 * wrapper (spacer and all) instead.
 *
 * This drives the real hooks with a controllable matchMedia: the same
 * `change` events the browser fires, delivered to the same listeners.
 */
vi.mock('../../src/three/utils/detectWebglSupport', () => ({ detectWebglSupport: () => false }))

const DESKTOP = 1280
const TABLET = 800

const state = { width: DESKTOP, reduced: false }
type Listener = (event: { matches: boolean; media: string }) => void
const listeners = new Map<string, Set<Listener>>()

function evaluate(query: string): boolean {
  return query.split(' and ').every((part) => {
    const minWidth = part.match(/min-width:\s*(\d+)px/)
    if (minWidth) return state.width >= Number(minWidth[1])
    if (part.includes('prefers-reduced-motion: no-preference')) return !state.reduced
    if (part.includes('prefers-reduced-motion: reduce')) return state.reduced
    return false
  })
}

const originalMatchMedia = window.matchMedia

function installMatchMedia() {
  listeners.clear()
  window.matchMedia = ((query: string) => {
    const set = listeners.get(query) ?? new Set()
    listeners.set(query, set)
    return {
      get matches() {
        return evaluate(query)
      },
      media: query,
      onchange: null,
      addEventListener: (type: string, fn: never) => type === 'change' && set.add(fn),
      removeEventListener: (type: string, fn: never) => type === 'change' && set.delete(fn),
      addListener: (fn: never) => set.add(fn),
      removeListener: (fn: never) => set.delete(fn),
      dispatchEvent: () => false,
    }
  }) as unknown as typeof window.matchMedia
}

/** Change the "viewport" and deliver the resulting `change` events, as a browser does. */
async function flip(patch: Partial<typeof state>) {
  Object.assign(state, patch)
  await act(async () => {
    for (const [query, set] of listeners) {
      for (const fn of [...set]) fn({ matches: evaluate(query), media: query })
    }
  })
}

async function settle() {
  await act(async () => {
    await loadGsap()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

const SECTION_IDS = [
  'statement',
  'what-we-build',
  'featured-project',
  'visakram-way',
  'from-plan-to-place',
  'home-tour',
  'how-we-build',
  'customer-stories',
]

let uncaught: string[] = []
const onError = (event: ErrorEvent) => uncaught.push(event.message)

beforeEach(() => {
  // jsdom does not implement scrollTo, which ScrollTrigger calls on refresh; stub it to keep output clean.
  window.scrollTo = (() => {}) as typeof window.scrollTo
  state.width = DESKTOP
  state.reduced = false
  installMatchMedia()
  uncaught = []
  window.addEventListener('error', onError)
})

afterEach(() => {
  window.removeEventListener('error', onError)
  window.matchMedia = originalMatchMedia
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
    </MemoryRouter>,
  )
}

function expectHomeIntact(container: HTMLElement) {
  // the React root is still mounted, with content in it
  expect(container.childElementCount).toBeGreaterThan(0)
  expect(container.textContent?.length ?? 0).toBeGreaterThan(500)
  expect(container.querySelector('h1')).not.toBeNull()
  // no unrelated Home section was removed
  for (const id of SECTION_IDS) expect(container.querySelector(`#${id}`), id).not.toBeNull()
}

describe('Home Tour — eligibility flipping while mounted (removeChild regression)', () => {
  it(
    'drops from the pinned tour to the static block, and back, without throwing or blanking the page',
    { timeout: 30_000 },
    async () => {
      const { container } = renderHome()
      await settle()

      const tour = () => container.querySelector('#home-tour') as HTMLElement
      expect(tour()).toHaveAttribute('data-mode', 'tour')
      // The precondition that makes this test meaningful: GSAP really has reparented
      // the pinned panel into a pin-spacer, the exact state that used to crash.
      expect(tour().querySelector('.pin-spacer')).not.toBeNull()

      // desktop → tablet: the pinned branch is replaced by the static fallback
      await expect(flip({ width: TABLET })).resolves.toBeUndefined()
      await settle()
      expect(tour()).toHaveAttribute('data-mode', 'static')
      expect(tour().querySelector('.pin-spacer')).toBeNull()
      expect(tour().querySelectorAll('img, [data-tour-chapter]').length).toBeGreaterThan(0)
      expectHomeIntact(container)

      // tablet → desktop: the tour comes back and pins again
      await expect(flip({ width: DESKTOP })).resolves.toBeUndefined()
      await settle()
      expect(tour()).toHaveAttribute('data-mode', 'tour')
      expect(tour().querySelector('.pin-spacer')).not.toBeNull()
      expectHomeIntact(container)

      expect(uncaught).toEqual([])
    },
  )

  it(
    'survives the reduced-motion preference flipping on and off',
    { timeout: 30_000 },
    async () => {
      const { container } = renderHome()
      await settle()
      expect(container.querySelector('#home-tour')).toHaveAttribute('data-mode', 'tour')

      await expect(flip({ reduced: true })).resolves.toBeUndefined()
      await settle()
      expect(container.querySelector('#home-tour')).toHaveAttribute('data-mode', 'static')
      expectHomeIntact(container)

      await expect(flip({ reduced: false })).resolves.toBeUndefined()
      await settle()
      expect(container.querySelector('#home-tour')).toHaveAttribute('data-mode', 'tour')
      expectHomeIntact(container)

      expect(uncaught).toEqual([])
    },
  )

  it(
    'keeps From Plan to Place and the Visakram Way mounted and intact through the flip',
    { timeout: 30_000 },
    async () => {
      const { container } = renderHome()
      await settle()
      const way = container.querySelector('#visakram-way')
      const plan = container.querySelector('#from-plan-to-place')
      expect(way).not.toBeNull()
      expect(plan).not.toBeNull()

      await flip({ width: TABLET })
      await settle()
      await flip({ width: DESKTOP })
      await settle()

      // the very same DOM nodes, not remounted copies
      expect(container.querySelector('#visakram-way')).toBe(way)
      expect(container.querySelector('#from-plan-to-place')).toBe(plan)
      expect(uncaught).toEqual([])
    },
  )
})
