import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Project } from '../../src/data/projects'

/**
 * `projects` is empty in the real app and stays that way until the client
 * supplies real projects — see tests/unit/routes.test.tsx for the real,
 * unmocked 404 behaviour on an unknown slug. This file mocks the data
 * module, in isolation, purely to verify the detail page's *architecture*
 * — the fixed 6-section structure, and that every section only appears
 * when its data actually exists — once real data lands. Fixture names are
 * deliberately synthetic so they can never be mistaken for real work.
 */
const fullFixture: Project = {
  slug: 'test-fixture-full-detail',
  name: 'Test Fixture Full Detail — not a real Visakram project',
  location: 'Test Fixture Full Locality',
  category: 'apartment',
  status: 'completed',
  year: '2025',
  description: 'Fixture description used only to test the project detail page.',
  details: [
    { label: 'Plot size', value: '1200 sq. ft.' },
    { label: 'Units', value: '4' },
  ],
  media: {
    hero: { src: '/test-fixture-full-hero.jpg', alt: 'Test fixture full detail hero image' },
    gallery: [
      { src: '/test-fixture-full-1.jpg', alt: 'Test fixture gallery image one' },
      { src: '/test-fixture-full-2.jpg', alt: 'Test fixture gallery image two' },
    ],
    video: {
      src: '/test-fixture-full.mp4',
      poster: '/test-fixture-full-poster.jpg',
      alt: 'Test fixture walkthrough video',
    },
  },
  seo: { metaDescription: 'A fixture-only meta description for testing.' },
}

const minimalFixture: Project = {
  slug: 'test-fixture-minimal-detail',
  name: 'Test Fixture Minimal Detail — not a real Visakram project',
  location: 'Test Fixture Minimal Locality',
  category: 'villa',
  media: { gallery: [] },
}

const fixtureProjects: Project[] = [fullFixture, minimalFixture]

vi.mock('../../src/data/projects', () => ({
  projects: fixtureProjects,
  getProjectBySlug: (slug: string) => fixtureProjects.find((project) => project.slug === slug),
  getFeaturedProject: () => fixtureProjects[0],
}))

async function renderDetail(slug: string) {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <App />
    </MemoryRouter>,
  )
}

describe('project detail — full data', () => {
  it('renders every section this data actually has, nothing invented', async () => {
    await renderDetail(fullFixture.slug)

    expect(screen.getByRole('heading', { level: 1, name: fullFixture.name })).toBeInTheDocument()
    expect(screen.getByText(fullFixture.location)).toBeInTheDocument()
    expect(screen.getByText(fullFixture.description!)).toBeInTheDocument()

    const factsRegion = screen
      .getByRole('heading', { level: 2, name: 'Project facts' })
      .closest('section') as HTMLElement
    expect(within(factsRegion).getByText('Plot size')).toBeInTheDocument()
    expect(within(factsRegion).getByText('1200 sq. ft.')).toBeInTheDocument()
    expect(within(factsRegion).getByText('Units')).toBeInTheDocument()

    const galleryRegion = screen
      .getByRole('heading', { level: 2, name: 'Gallery' })
      .closest('section') as HTMLElement
    expect(within(galleryRegion).getAllByRole('img')).toHaveLength(2)
    expect(
      within(galleryRegion).getByRole('img', { name: 'Test fixture gallery image one' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 2, name: 'Video' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute(
      'href',
      '/contact',
    )
  })

  it("uses the project's own approved meta description over the generated fallback", async () => {
    await renderDetail(fullFixture.slug)
    expect(document.title).toBe(`${fullFixture.name} — Visakram Builders`)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      fullFixture.seo!.metaDescription,
    )
  })
})

describe('project detail — unknown slug', () => {
  it('shows the existing 404 page instead of inventing a project', async () => {
    await renderDetail('not-a-real-fixture-slug')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})

describe('project detail — minimal data (no description, facts, gallery or video)', () => {
  it('renders only Hero and Closing CTA — no fabricated section for missing data', async () => {
    await renderDetail(minimalFixture.slug)

    expect(screen.getByRole('heading', { level: 1, name: minimalFixture.name })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Project facts' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Gallery' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Video' })).not.toBeInTheDocument()
    expect(screen.getByText(`Dev placeholder · ${minimalFixture.name}`)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start a project' })).toBeInTheDocument()
  })

  it("falls back to a description built only from the project's own verified fields", async () => {
    await renderDetail(minimalFixture.slug)
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description).toContain(minimalFixture.name)
    expect(description).toContain(minimalFixture.location)
    expect(description).toContain('Visakram Builders')
  })
})
