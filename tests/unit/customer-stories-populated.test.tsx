import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Testimonial } from '../../src/data/testimonials'
import type { Project } from '../../src/data/projects'

/**
 * `testimonials` (and `projects`) are empty in the real app — see
 * customer-stories.test.tsx for that (current, real) state. This file
 * mocks both data modules, in isolation, purely to verify the
 * *architecture* the customer-stories section and TestimonialCard are
 * built on actually works once real, approved material lands. Fixture
 * names are deliberately synthetic so they can never be mistaken for real
 * Visakram Builders customers or work.
 */
const referencedProject: Project = {
  slug: 'test-fixture-referenced-project',
  name: 'Test Fixture Referenced Project — not a real Visakram project',
  location: 'Test Fixture Locality',
  category: 'villa',
  media: { gallery: [] },
}

const fixtureProjects: Project[] = [referencedProject]

vi.mock('../../src/data/projects', () => ({
  projects: fixtureProjects,
  getProjectBySlug: (slug: string) => fixtureProjects.find((project) => project.slug === slug),
  getFeaturedProject: () => undefined,
}))

const fullFixture: Testimonial = {
  id: 'test-fixture-full',
  customerName: 'Test Fixture Customer — not a real person',
  quote: 'A fixture-only quote used solely to test the testimonial architecture.',
  project: referencedProject.slug,
  location: 'Test Fixture Location',
  role: 'Homeowner',
  date: '2026-01-01',
  rating: 5,
  image: { src: '/test-fixture-customer.jpg', alt: 'Test fixture customer portrait' },
}

const videoFixture: Testimonial = {
  id: 'test-fixture-video',
  customerName: 'Test Fixture Video Customer — not a real person',
  quote: 'A fixture-only video testimonial quote.',
  video: {
    src: '/test-fixture-testimonial.mp4',
    poster: '/test-fixture-testimonial-poster.jpg',
    alt: 'Test fixture testimonial video',
  },
}

const minimalFixture: Testimonial = {
  id: 'test-fixture-minimal',
  customerName: 'Test Fixture Minimal Customer — not a real person',
  quote: 'A fixture-only quote with no optional metadata at all.',
}

const brokenReferenceFixture: Testimonial = {
  id: 'test-fixture-broken-reference',
  customerName: 'Test Fixture Broken-Reference Customer — not a real person',
  quote: 'A fixture-only quote referencing a project that does not exist.',
  project: 'not-a-real-project-slug',
}

const fixtureTestimonials: Testimonial[] = [
  fullFixture,
  videoFixture,
  minimalFixture,
  brokenReferenceFixture,
]

vi.mock('../../src/data/testimonials', () => ({
  testimonials: fixtureTestimonials,
  getTestimonialById: (id: string) => fixtureTestimonials.find((t) => t.id === id),
}))

async function renderHome() {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function getSection() {
  const heading = screen.getByRole('heading', { level: 2, name: 'Customer stories.' })
  return heading.closest('section') as HTMLElement
}

describe('homepage customer stories — once real testimonials exist', () => {
  it('renders one card per testimonial, sourced from data, no carousel wrapper', async () => {
    await renderHome()
    const section = getSection()
    expect(section.querySelectorAll('figure')).toHaveLength(fixtureTestimonials.length)
  })

  it('renders the quote and customer name from data', async () => {
    await renderHome()
    const section = getSection()
    const scoped = within(section)
    expect(scoped.getByText(`“${fullFixture.quote}”`)).toBeInTheDocument()
    expect(scoped.getByText(fullFixture.customerName)).toBeInTheDocument()
  })

  it('renders optional metadata only when supplied', async () => {
    await renderHome()
    const section = getSection()
    const scoped = within(section)
    expect(scoped.getByText(fullFixture.role!)).toBeInTheDocument()
    expect(scoped.getByText(fullFixture.location!)).toBeInTheDocument()
    expect(scoped.getByText('5 / 5')).toBeInTheDocument()
  })

  it('renders no role, location or rating for a testimonial with none supplied', async () => {
    await renderHome()
    const section = getSection()
    const minimalFigure = within(section)
      .getByText(minimalFixture.customerName)
      .closest('figure') as HTMLElement
    const scoped = within(minimalFigure)
    // Only the customer name is present in the caption — nothing else.
    expect(scoped.queryByText(/homeowner/i)).not.toBeInTheDocument()
    expect(minimalFigure.querySelectorAll('img, video')).toHaveLength(0)
  })

  it('shows the real image and its real alt text when a customer photo exists', async () => {
    await renderHome()
    const section = getSection()
    expect(within(section).getByRole('img', { name: fullFixture.image!.alt })).toBeInTheDocument()
  })

  it('renders a real video testimonial with controls, no preload, and a poster — never autoplay', async () => {
    await renderHome()
    const section = getSection()
    const videoFigure = within(section)
      .getByText(videoFixture.customerName)
      .closest('figure') as HTMLElement
    const video = videoFigure.querySelector('video') as HTMLVideoElement
    expect(video).toBeTruthy()
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('preload', 'none')
    expect(video).toHaveAttribute('poster', videoFixture.video!.poster)
    expect(video).not.toHaveAttribute('autoplay')
    expect(video.querySelector('source')).toHaveAttribute('src', videoFixture.video!.src)
  })

  it('links to the project detail page when the referenced project actually exists', async () => {
    await renderHome()
    const section = getSection()
    expect(within(section).getByRole('link', { name: referencedProject.name })).toHaveAttribute(
      'href',
      `/projects/${referencedProject.slug}`,
    )
  })

  it('renders without a broken link when the referenced project slug does not resolve', async () => {
    await renderHome()
    const section = getSection()
    const brokenFigure = within(section)
      .getByText(brokenReferenceFixture.customerName)
      .closest('figure') as HTMLElement
    // The testimonial itself still renders...
    expect(within(brokenFigure).getByText(`“${brokenReferenceFixture.quote}”`)).toBeInTheDocument()
    // ...but no link was created for the unresolved project reference.
    expect(within(brokenFigure).queryAllByRole('link')).toHaveLength(0)
  })
})
