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
  media: {
    hero: { src: '/test-fixture.jpg', alt: 'Test fixture image, not a real project photo' },
    gallery: [],
  },
}

vi.mock('../../src/data/projects', () => ({
  projects: [testFixtureProject],
  getProjectBySlug: (slug: string) =>
    slug === testFixtureProject.slug ? testFixtureProject : undefined,
  getFeaturedProject: () => testFixtureProject,
}))

describe('featured project — once real project data exists', () => {
  it('renders the project title, metadata and a link built from the data alone', async () => {
    const { App } = await import('../../src/app/App')
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    // the featured project is the last card of the What We Build carousel
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Featured project.' }),
    ).not.toBeInTheDocument()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    const card = scoped
      .getByRole('heading', { level: 3, name: 'Featured projects' })
      .closest('li') as HTMLElement

    expect(within(card).getByText(new RegExp(testFixtureProject.name))).toBeInTheDocument()
    expect(within(card).getByText(new RegExp(testFixtureProject.location))).toBeInTheDocument()
    expect(within(card).getByRole('link')).toHaveAttribute(
      'href',
      `/projects/${testFixtureProject.slug}`,
    )
    // Real photography gets its real alt text, not a blank decorative one.
    expect(
      within(card).getByRole('img', { name: testFixtureProject.media.hero!.alt }),
    ).toBeInTheDocument()
    // A real project is not marked as a preview
    expect(card).not.toHaveAttribute('data-preview')
  })
})
