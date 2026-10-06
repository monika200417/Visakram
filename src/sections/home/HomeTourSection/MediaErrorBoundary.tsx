import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; onError?: () => void }
type State = { hasError: boolean }

/**
 * Catches a render-time failure in the Home Tour's media subtree so the rest of
 * the page keeps working; the section reacts by dropping to its static block of
 * stills. (Media load failures are handled inside HomeTourMedia, per chapter.)
 */
export class MediaErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[HomeTour] media failed, showing static fallback.', error)
    this.props.onError?.()
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}
