import { act, render } from '@testing-library/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadGsap } from '../../src/animations/gsap'
import { HomePage } from '../../src/pages/HomePage'

/**
 * Two regressions around the Home Tour's live eligibility changes (the
 * viewport crossing 1024px, a tablet rotating, the reduced-motion preference
 * changing). Both drive the real hooks with a controllable matchMedia: the same
 * `change` events a browser fires, delivered to the same listeners.
 *
 * 1. removeChild crash. GSAP wraps the pinned panel in a `.pin-spacer`, so
 *    React's attempt to remove the panel itself threw `NotFoundError` and
 *    unmounted the whole app. The pinned branch now sits inside a React-owned
 *    wrapper, so React removes the wrapper (spacer and all) instead.
 *
 * 2. Stale pin range. After desktop → tablet → desktop, React re-renders the
 *    Tour first, so its ScrollTrigger is created BEFORE the Visakram Way and
 *    From Plan to Place re-form their pins. ScrollTrigger refreshes in creation
 *    order, so the Tour was measured without the scroll space those two pins
 *    add (3,302px in the browser) and kept a start/end that no longer matched
 *    its place on the page. jsdom has no layout, so pixel offsets cannot be
 *    asserted here; what decides them is the ORDER triggers are measured in,
 *    and that is asserted instead (the pixel values are checked in a real browser).
 */
vi.mock('../../src/three/utils/detectWebglSupport', () => ({ detectWebglSupport: () => false }))

const DESKTOP = 1280
const TABLET = 800
const MOBILE = 375

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

/**
 * Change the "viewport" and deliver the resulting `change` events. Delivered in
 * the order observed in a real browser: the React-owned eligibility queries
 * (the plain ones) first, each followed by React's render, and only then GSAP's
 * own compound-query pass. That is the order that creates the Tour's trigger
 * before its siblings'.
 */
async function flip(patch: Partial<typeof state>) {
  Object.assign(state, patch)
  const pending = [...listeners].flatMap(([query, set]) =>
    [...set].map((fn) => ({ query, fn, reactOwned: !query.includes(' and ') })),
  )
  pending.sort((a, b) => Number(b.reactOwned) - Number(a.reactOwned))
  for (const { query, fn } of pending) {
    await act(async () => fn({ matches: evaluate(query), media: query }))
  }
}

async function settle() {
  await act(async () => {
    await loadGsap()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

type Pin = 'hero' | 'way' | 'plan' | 'tour'
const pinOf = (t: ScrollTrigger): Pin => {
  const el = t.trigger as Element
  if (el.closest('#visakram-way')) return 'way'
  if (el.closest('#from-plan-to-place')) return 'plan'
  if (el.closest('#home-tour')) return 'tour'
  return 'hero'
}
const pins = () => ScrollTrigger.getAll().filter((t) => t.pin)
const pinNames = () => pins().map(pinOf).sort()
const ALL_PINS: Pin[] = ['hero', 'plan', 'tour', 'way']

/** The pin triggers in the order ScrollTrigger measured them, one entry per refresh. */
let refreshOrders: Pin[][] = []
const onRefresh = () => refreshOrders.push(pins().map(pinOf))

/** Every refresh that contained the Tour alongside both siblings must measure the Tour last. */
function expectTourMeasuredAfterSiblings(orders: Pin[][]) {
  const full = orders.filter((o) => o.includes('tour') && o.includes('way') && o.includes('plan'))
  expect(full.length).toBeGreaterThan(0)
  for (const order of full) {
    const tour = order.indexOf('tour')
    expect(tour, `measured in the order ${order.join(' → ')}`).toBeGreaterThan(order.indexOf('way'))
    expect(tour, `measured in the order ${order.join(' → ')}`).toBeGreaterThan(
      order.indexOf('plan'),
    )
  }
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
  refreshOrders = []
  window.addEventListener('error', onError)
  ScrollTrigger.addEventListener('refresh', onRefresh)
})

afterEach(() => {
  ScrollTrigger.removeEventListener('refresh', onRefresh)
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
      expect(pinNames()).toEqual(ALL_PINS)
      expectTourMeasuredAfterSiblings(refreshOrders)
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

describe('Home Tour — pin range after a breakpoint round trip (stale measurement regression)', () => {
  it('measures the Tour after the sibling pins on first load', { timeout: 30_000 }, async () => {
    renderHome()
    await settle()

    expect(pinNames()).toEqual(ALL_PINS)
    expect(refreshOrders.length).toBeGreaterThan(0)
    // initial desktop layout: the Tour's range is measured last, against the final layout
    expect(pins().map(pinOf).at(-1)).toBe('tour')
    expectTourMeasuredAfterSiblings(refreshOrders)
  })

  it.each([
    ['tablet', TABLET],
    ['mobile', MOBILE],
  ])(
    'desktop → %s → desktop: siblings release and re-form, and the Tour is measured after them',
    { timeout: 30_000 },
    async (_label, narrow) => {
      const { container } = renderHome()
      await settle()
      expect(pinNames()).toEqual(ALL_PINS)

      // down: the Visakram Way, From Plan to Place and the Tour release; only the hero may keep a pin
      refreshOrders = []
      await flip({ width: narrow })
      await settle()
      expect(container.querySelector('#home-tour')).toHaveAttribute('data-mode', 'static')
      expect(pinNames()).not.toContain('way')
      expect(pinNames()).not.toContain('plan')
      expect(pinNames()).not.toContain('tour')

      // up: all four re-form, and every refresh measures the Tour after both siblings
      refreshOrders = []
      await flip({ width: DESKTOP })
      await settle()
      expect(container.querySelector('#home-tour')).toHaveAttribute('data-mode', 'tour')
      expect(pinNames()).toEqual(ALL_PINS)
      expectTourMeasuredAfterSiblings(refreshOrders)
      // and a refresh from any other source (a resize, a font load) keeps that order
      act(() => ScrollTrigger.refresh(true))
      expectTourMeasuredAfterSiblings(refreshOrders)

      expectHomeIntact(container)
      expect(uncaught).toEqual([])
    },
  )

  it('survives several round trips without the order drifting', { timeout: 30_000 }, async () => {
    renderHome()
    await settle()
    for (const narrow of [TABLET, MOBILE, TABLET]) {
      await flip({ width: narrow })
      await settle()
      await flip({ width: DESKTOP })
      await settle()
    }
    expect(pinNames()).toEqual(ALL_PINS)
    expect(pins().map(pinOf).at(-1)).toBe('tour')
    expectTourMeasuredAfterSiblings(refreshOrders)
    expect(uncaught).toEqual([])
  })
})
