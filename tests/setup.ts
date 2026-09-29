/// <reference types="node" />
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

/**
 * Milestone 4 added several more GSAP-consuming sections to the homepage,
 * so more `loadGsap()` dynamic imports are now in flight per render. Each
 * hook already guards against ACTING after unmount (the `cancelled` /
 * `isConnected` checks in every animation hook), but the underlying dynamic
 * `import('gsap')` itself is a fire-and-forget promise a test's fast,
 * synchronous render/assert can easily outrun — when that happens, Vitest
 * tears down the jsdom environment for that test file before the import
 * settles, and the module loader rejects with "environment was torn down".
 * That rejection carries no information (nothing was acted on; the hook's
 * own guard already made that a no-op) and does not fail any test — but it
 * is noisy and can trip a stricter unhandled-rejection policy elsewhere.
 * Swallow only this specific, benign shape; anything else still surfaces.
 */
process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason)
  if (message.includes('after the environment was torn down')) {
    return
  }
  // Not the known benign case — make sure it still fails the run instead of
  // silently disappearing.
  console.error('Unhandled rejection in tests:', reason)
  process.exitCode = 1
})
