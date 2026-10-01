import { Component, type ReactNode } from 'react'

type ThreeErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  onError?: () => void
}

type ThreeErrorBoundaryState = {
  hasError: boolean
}

/**
 * Catches a render-time failure anywhere in the lazy-loaded 3D subtree
 * (docs/TECHNICAL-ARCHITECTURE.md §23 — "A failed 3D module should not
 * break the entire website"; docs/QA-CHECKLIST.md §15 "WebGL failure
 * scenario"). React error boundaries must be class components — there is
 * no hook equivalent. On error, renders `fallback` (the same static HTML
 * story visual used for reduced motion / mobile / no-WebGL) instead of a
 * blank canvas or a crashed page, and notifies the parent via `onError` so
 * it stops retrying the canvas for the rest of this page visit.
 */
export class ThreeErrorBoundary extends Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  state: ThreeErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ThreeErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Deliberately no console spam beyond a single, clearly-labelled line —
    // real errors during development should still be visible.
    console.error('[FromPlanToPlace] 3D scene failed, showing static fallback.', error)
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
