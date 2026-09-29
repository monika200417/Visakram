import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())

/**
 * jsdom implements none of these, but the real GSAP + ScrollTrigger
 * packages (used for real, not mocked, in tests) need them to run without
 * throwing. jsdom also does no real layout, so ScrollTrigger's own
 * measurements are inert here — these polyfills only stop it from crashing;
 * they don't simulate scroll behavior. See Milestone 3 report for what
 * scroll-driven behavior this does and doesn't verify.
 */
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- jsdom has no ResizeObserver type; this is a minimal test-only stand-in.
  window.ResizeObserver = MockResizeObserver
}

if (typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16)
  window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle)
}
