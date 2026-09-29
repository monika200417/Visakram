import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('routing', () => {
  it.each([
    ['/', 'Places that hold their ground.'],
    ['/projects', 'Projects'],
    ['/services', 'Services'],
    [
      '/about',
      '20+ years of construction experience, carried into a contemporary way of building.',
    ],
    ['/process', 'Process'],
    ['/contact', 'Start a project.'],
  ])('%s renders one h1 inside main', (path, heading) => {
    renderAt(path)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('shows not-found for an unknown route', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows not-found for an unknown project slug (no invented projects)', () => {
    renderAt('/projects/not-a-real-project')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('exposes a skip link to main content', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })
})
