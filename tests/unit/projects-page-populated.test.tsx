import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Project } from '../../src/data/projects'

/**
 * `projects` is empty in the real app and stays that way until the client
 * supplies a real project — see projects-page.test.tsx for that (current,
 * real) state. This file mocks the data module, in isolation, purely to
 * verify the *architecture* the archive page is built on — filtering,
 * card rendering, per-page SEO — actually works once real data lands. The
 * fixtures below are test-only and deliberately named so they can never be
 * mistaken for real Visakram Builders work.
 */
const villaFixture: Project = {
  slug: 'test-fixture-villa',
  name: 'Test Fixture Villa — not a real Visakram project',
  location: 'Test Fixture Locality',
  category: 'villa',
  year: '2025',
  media: { gallery: [] },
}

const apartmentFixture: Project = {
  slug: 'test-fixture-apartment',
  name: 'Test Fixture Apartment — not a real Visakram project',
  location: 'Test Fixture Locality Two',
  category: 'apartment',
  media: {
    hero: { src: '/test-fixture-apartment.jpg', alt: 'Test fixture apartment image, not real' },
    gallery: [],
  },
}

const fixtureProjects: Project[] = [villaFixture, apartmentFixture]

vi.mock('../../src/data/projects', () => ({
  projects: fixtureProjects,
  getProjectBySlug: (slug: string) => fixtureProjects.find((project) => project.slug === slug),
  getFeaturedProject: () => fixtureProjects[0],
}))

async function renderProjects() {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <App />
    </MemoryRouter>,
  )
}

describe('projects archive — once real project data exists', () => {
  it('renders a card per project, sourced from data, with graceful no-image handling', async () => {
    await renderProjects()

    const listRegion = screen.getByRole('region', { name: 'All projects' })
    const items = within(listRegion).getAllByRole('listitem')
    expect(items).toHaveLength(2)

    expect(
      screen.getByRole('link', { name: `${villaFixture.name} — view project` }),
    ).toHaveAttribute('href', `/projects/${villaFixture.slug}`)
    expect(
      screen.getByRole('link', { name: `${apartmentFixture.name} — view project` }),
    ).toHaveAttribute('href', `/projects/${apartmentFixture.slug}`)

    // Real photography gets its real alt text when present...
    expect(screen.getByRole('img', { name: apartmentFixture.media.hero!.alt })).toBeInTheDocument()
    // ...and the established dev-placeholder convention covers a project
    // with no photo yet, rather than a blank box or a generic icon.
    expect(screen.getByText(`Dev placeholder · ${villaFixture.name}`)).toBeInTheDocument()
  })

  it('filters the grid by category client-side, without navigating away', async () => {
    await renderProjects()

    const villasButton = screen.getByRole('button', { name: 'Villas' })
    fireEvent.click(villasButton)

    expect(villasButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('link', { name: `${villaFixture.name} — view project` }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: `${apartmentFixture.name} — view project` }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(
      screen.getByRole('link', { name: `${apartmentFixture.name} — view project` }),
    ).toBeInTheDocument()
  })

  it('shows a category-specific empty message when a filter matches nothing', async () => {
    await renderProjects()

    fireEvent.click(screen.getByRole('button', { name: 'Residential Construction' }))
    expect(
      screen.getByText(/no residential construction projects to show yet/i),
    ).toBeInTheDocument()
  })

  it('sets the document title and description from verified site data', async () => {
    await renderProjects()
    expect(document.title).toBe('Projects — Visakram Builders')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'Visakram Builders',
    )
  })
})
