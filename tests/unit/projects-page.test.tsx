import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { services } from '../../src/data/services'
import {
  projectsPageCategoryImages,
  projectsPageGallery,
  projectsPageHero,
} from '../../src/data/projectsPageMedia'

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
  it('lists the sample images under the filter: all of them for "All", only that category otherwise', () => {
    renderProjects()
    const gallery = screen.getByRole('region', { name: 'Gallery' })
    expect(within(gallery).getAllByRole('listitem')).toHaveLength(projectsPageGallery.length)

    fireEvent.click(screen.getByRole('button', { name: 'Apartments' }))
    const apartments = projectsPageGallery.filter((image) => image.category === 'apartment')
    expect(within(gallery).getAllByRole('listitem')).toHaveLength(apartments.length)

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(within(gallery).getAllByRole('listitem')).toHaveLength(projectsPageGallery.length)
  })

  it('shows stock photography in every section', () => {
    renderProjects()
    expect(screen.getByRole('img', { name: projectsPageHero.alt })).toHaveAttribute(
      'src',
      projectsPageHero.src,
    )
    // every category button carries its own picture and keeps its text name
    const group = screen.getByRole('group', { name: /filter projects by category/i })
    for (const service of services) {
      expect(projectsPageCategoryImages[service.slug]).toBeDefined()
      const button = within(group).getByRole('button', { name: service.title })
      expect(button.querySelector('img')).not.toBeNull()
    }
  })

  it('renders exactly one h1 and no project cards, and no "no projects" message', () => {
    renderProjects()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument()

    expect(screen.queryByRole('region', { name: 'All projects' })).not.toBeInTheDocument()
    expect(screen.queryByText(/no projects to show yet/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/illustrative photography/i)).not.toBeInTheDocument()
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
