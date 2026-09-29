import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Project } from '../../src/data/projects'

/**
 * `projects` is empty in the real app (src/data/projects.ts) and stays
 * that way until the client supplies a real project — see
 * homepage-chapters.test.tsx for that (current, real) state. This file
 * mocks the data module, in isolation, purely to verify the *architecture*
 * FeaturedProjectSection is built on actually renders correctly once real
 * data lands — the mocked project below is a test fixture only, never
 * rendered by the real app, and is deliberately named so it can't be
 * mistaken for real Visakram work.
 */
const testFixtureProject: Project = {
  slug: 'test-fixture-project',
  name: 'Test Fixture Project — not a real Visakram project',
  location: 'Test Location',
  category: 'villa',
  status: 'completed',
  year: '2026',
  description: 'Fixture description used only to test the Featured Project component.',
  images: ['/test-fixture.jpg'],
}

vi.mock('../../src/data/projects', () => ({
  projects: [testFixtureProject],
  getProjectBySlug: (slug: string) =>
    slug === testFixtureProject.slug ? testFixtureProject : undefined,
}))

describe('featured project — once real project data exists', () => {
  it('renders the project title, metadata and a link built from the data alone', async () => {
    const { App } = await import('../../src/app/App')
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Featured project.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)

    expect(
      scoped.getByRole('heading', { level: 3, name: testFixtureProject.name }),
    ).toBeInTheDocument()
    expect(scoped.getByText(testFixtureProject.location)).toBeInTheDocument()
    expect(scoped.getByText('Villas')).toBeInTheDocument()
    expect(scoped.getByText(testFixtureProject.description!)).toBeInTheDocument()
    expect(scoped.getByRole('link', { name: /view project/i })).toHaveAttribute(
      'href',
      `/projects/${testFixtureProject.slug}`,
    )
    // No "awaiting content" placeholder once real data exists.
    expect(scoped.queryByText(/awaiting a client-approved project/i)).not.toBeInTheDocument()
  })
})
