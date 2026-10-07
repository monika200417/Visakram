import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Verifies the *architecture* of the canvas-eligible path — desktop,
 * motion allowed, WebGL reported available — without attempting brittle
 * real-WebGL rendering (Milestone 10 §26 explicitly asks for this: mock
 * the R3F canvas, test the surrounding React data flow). The real 3D
 * module (src/three/components/PlanToPlaceCanvas) is replaced with a
 * lightweight stand-in that records the props it was given, so this
 * confirms FromPlanToPlaceSection actually reaches for the lazy 3D
 * module and hands it a shared progress ref, without ever loading
 * Three.js/R3F/drei in the test run. See from-plan-to-place.test.tsx for
 * the real (fallback) rendering path.
 */
vi.mock('../../src/three/utils/detectWebglSupport', () => ({
  detectWebglSupport: () => true,
}))

vi.mock('../../src/three/components/PlanToPlaceCanvas', () => ({
  default: ({ progressRef, isVisible }: { progressRef: unknown; isVisible: boolean }) => (
    <div
      data-testid="mock-plan-to-place-canvas"
      data-has-progress-ref={String(Boolean(progressRef))}
      data-visible={String(isVisible)}
    />
  ),
}))

const originalMatchMedia = window.matchMedia

function stubMatchMediaAsDesktopMotionOk() {
  window.matchMedia = ((query: string) => {
    const matches = query.includes('min-width: 1024px') || query.includes('no-preference')
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

beforeEach(() => {
  stubMatchMediaAsDesktopMotionOk()
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.resetModules()
})

async function renderHome() {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage — from plan to place (canvas-eligible, mocked 3D module)', () => {
  // This test cold-imports the whole app graph (vi.resetModules + dynamic import), so it is
  // heavy next to its siblings: ~3s alone, but it climbs past vitest's 5s default when the full
  // suite runs in parallel. The explicit timeout is headroom, not a change in what is asserted.
  it(
    'reaches for the lazy 3D module and passes it a shared progress ref, instead of the static fallback',
    { timeout: 20_000 },
    async () => {
      await renderHome()
      const canvasStandIn = await screen.findByTestId('mock-plan-to-place-canvas')
      expect(canvasStandIn).toHaveAttribute('data-has-progress-ref', 'true')

      // The static HTML story text is still present alongside the mocked
      // canvas — the canvas never replaces it (docs/SEO-SPEC.md §28).
      const heading = screen.getByRole('heading', { level: 2, name: 'From plan to place.' })
      const section = heading.closest('section') as HTMLElement
      expect(within(section).getByRole('heading', { level: 3, name: 'Plan' })).toBeInTheDocument()
    },
  )
})
