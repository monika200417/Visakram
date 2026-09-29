import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { services } from '../../src/data/services'

/**
 * Real, currently-empty `projects` collection (src/data/projects.ts) — no
 * mocking here. See projects-page-populated.test.tsx for the architecture
 * once a real project exists.
 */
function renderProjects() {
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <App />
    </MemoryRouter>,
  )
}

describe('projects archive — real (currently empty) collection', () => {
  it('renders exactly one h1 and a refined, non-dominant empty state, no project cards', () => {
    renderProjects()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument()

    const listRegion = screen.getByRole('region', { name: 'All projects' })
    expect(within(listRegion).queryAllByRole('listitem')).toHaveLength(0)
    const empty = within(listRegion).getByText(/no projects to show yet/i)
    expect(empty).toHaveAttribute('data-dev-placeholder')
  })

  it('builds category filter buttons from services.ts — no duplicate or hardcoded category strings', () => {
    renderProjects()

    const group = screen.getByRole('group', { name: /filter projects by category/i })
    const buttons = within(group).getAllByRole('button')

    expect(buttons).toHaveLength(services.length + 1)
    expect(buttons[0]).toHaveTextContent('All')
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    for (const service of services) {
      expect(within(group).getByRole('button', { name: service.title })).toBeInTheDocument()
    }
  })
})
