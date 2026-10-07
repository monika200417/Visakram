import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { ServiceDetail } from '../../src/components/service/ServiceDetail'
import { primaryCta } from '../../src/data/navigation'
import { processSteps } from '../../src/data/process'
import type { Project } from '../../src/data/projects'
import { services, type Service } from '../../src/data/services'
import { site } from '../../src/data/site'

/**
 * The real services data is verified and non-empty, but its long
 * description, image and highlights are still unapproved — so the page tests
 * run against the real data layer (the current, honest state), and the
 * "once content arrives" behaviour is covered by rendering ServiceDetail
 * directly with clearly-labelled test fixtures.
 */
function renderServices() {
  return render(
    <MemoryRouter initialEntries={['/services']}>
      <App />
    </MemoryRouter>,
  )
}

const populatedFixture: Service = {
  slug: 'test-fixture-service',
  index: '09',
  category: 'villa',
  title: 'Test Fixture Service',
  shortDescription: 'Test fixture short description.',
  description: 'Test fixture long description, not real Visakram copy.',
  image: '/test-fixture-service.jpg',
  imageAlt: 'Test fixture service image, not real',
  highlights: ['Test fixture highlight one', 'Test fixture highlight two'],
}

const relatedFixture: Project = {
  slug: 'test-fixture-villa',
  name: 'Test Fixture Villa — not a real Visakram project',
  location: 'Test Fixture Locality',
  category: 'villa',
  media: { gallery: [] },
}

function renderDetail(service: Service, relatedProjects: readonly Project[] = []) {
  return render(
    <MemoryRouter>
      <ServiceDetail service={service} relatedProjects={relatedProjects} align="start" />
    </MemoryRouter>,
  )
}

describe('services page', () => {
  it('renders exactly one h1 with no skipped heading levels', () => {
    renderServices()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Villas, apartments and residential construction.',
      }),
    ).toBeInTheDocument()

    const headings = screen.getAllByRole('heading').map((el) => Number(el.tagName[1]))
    expect(headings[0]).toBe(1)
    expect(headings.filter((level) => level === 1)).toHaveLength(1)

    let deepestSeen = 1
    for (const level of headings) {
      expect(level).toBeLessThanOrEqual(deepestSeen + 1)
      deepestSeen = Math.max(deepestSeen, level)
    }
  })

  it('is no longer a development placeholder', () => {
    renderServices()
    expect(screen.queryByText(/Development placeholder/)).not.toBeInTheDocument()
  })

  it('builds the overview from services.ts — every service, in order, linking to its section', () => {
    renderServices()
    const nav = screen.getByRole('navigation', { name: 'Services' })
    const links = within(nav).getAllByRole('link')
    expect(services).toHaveLength(3)
    expect(links).toHaveLength(services.length)

    services.forEach((service, i) => {
      const link = links[i]!
      expect(link).toHaveAttribute('href', `#${service.slug}`)
      expect(within(link).getByText(service.title)).toBeInTheDocument()
      expect(within(link).getByText(service.shortDescription)).toBeInTheDocument()
      expect(within(link).getByText(service.index)).toBeInTheDocument()
    })
  })

  it('renders one detail section per service, each reachable from its overview link', () => {
    const { container } = renderServices()
    for (const service of services) {
      const section = container.querySelector(`section#${service.slug}`) as HTMLElement
      expect(section).not.toBeNull()
      const scoped = within(section)
      expect(scoped.getByRole('heading', { level: 2, name: service.title })).toBeInTheDocument()
      expect(scoped.getByText(service.shortDescription)).toBeInTheDocument()
    }
  })

  it('handles unapproved service fields without broken or fabricated UI', () => {
    const { container } = renderServices()
    for (const service of services) {
      // The real data really is still unapproved — if this ever fails because
      // content was added, the page already renders it (see the populated
      // ServiceDetail tests) and this assertion should simply be retired.
      expect(service.description).toBeUndefined()
      expect(service.image).toBeUndefined()
      expect(service.highlights).toBeUndefined()

      const section = container.querySelector(`section#${service.slug}`) as HTMLElement
      const scoped = within(section)
      // Image slot falls back to the obvious dev placeholder, never a fake photo.
      expect(scoped.getByText(`Dev placeholder · ${service.title}`)).toBeInTheDocument()
      expect(scoped.queryAllByRole('img')).toHaveLength(0)
      // No empty headings, lists or labels left behind for the missing fields.
      expect(scoped.queryByText('What we provide')).not.toBeInTheDocument()
      expect(scoped.queryByText('Related projects')).not.toBeInTheDocument()
      expect(scoped.queryAllByRole('list')).toHaveLength(0)
      expect(scoped.getAllByRole('heading')).toHaveLength(1)
    }
  })

  it('shows no related projects while projects.ts is empty (no invented work)', () => {
    renderServices()
    expect(screen.queryByText('Related projects')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()
  })

  it('sources the process from process.ts — all five approved steps, in order', () => {
    renderServices()
    const heading = screen.getByRole('heading', { level: 2, name: 'How every project runs.' })
    const scoped = within(heading.closest('section') as HTMLElement)
    const steps = scoped.getAllByRole('listitem')
    expect(steps).toHaveLength(processSteps.length)
    processSteps.forEach((step, i) => {
      expect(within(steps[i]!).getByRole('heading', { level: 3, name: step.title })).toBeVisible()
      expect(within(steps[i]!).getByText(step.description)).toBeInTheDocument()
    })
  })

  it('shows only the verified client-stated figures from site.ts', () => {
    renderServices()
    const proof = screen.getByRole('region', { name: `${site.name} in numbers` })
    expect(within(proof).getByText(site.stats.yearsExperience)).toBeInTheDocument()
    expect(within(proof).getByText(site.stats.completedProjects)).toBeInTheDocument()
    expect(within(proof).getByText(String(site.stats.ongoingProjects))).toBeInTheDocument()
  })

  it("ends with the site's existing primary CTA, no invented contact details", () => {
    renderServices()
    const ctaHeading = screen.getByRole('heading', { level: 2, name: 'Start a project.' })
    const section = ctaHeading.closest('section') as HTMLElement
    expect(within(section).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(href.startsWith('tel:')).toBe(false)
      expect(href.startsWith('mailto:')).toBe(false)
    }
  })

  it('sets the SEO-SPEC title and a description built from verified site data', () => {
    renderServices()
    expect(document.title).toBe(`Residential, Villa & Apartment Construction | ${site.name}`)
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description).toContain(site.name)
    for (const area of site.serviceAreas) expect(description).toContain(area)
    // site.siteUrl is unconfirmed, so no canonical is invented.
    expect(document.querySelector('link[rel="canonical"]')).toBeNull()
  })

  it('renders every section synchronously, independent of animation state', () => {
    renderServices()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'What we build.' })).toBeInTheDocument()
    for (const service of services) {
      expect(screen.getByRole('heading', { level: 2, name: service.title })).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { level: 2, name: 'Start a project.' })).toBeInTheDocument()
  })
})

describe('ServiceDetail', () => {
  it('renders approved description, image, highlights and related projects when they exist', () => {
    renderDetail(populatedFixture, [relatedFixture])

    expect(screen.getByRole('heading', { level: 2, name: populatedFixture.title })).toBeVisible()
    expect(screen.getByText(populatedFixture.shortDescription)).toBeInTheDocument()
    expect(screen.getByText(populatedFixture.description!)).toBeInTheDocument()

    const image = screen.getByRole('img', { name: populatedFixture.imageAlt })
    expect(image).toHaveAttribute('src', populatedFixture.image)
    expect(
      screen.queryByText(`Dev placeholder · ${populatedFixture.title}`),
    ).not.toBeInTheDocument()

    expect(screen.getByText('What we provide')).toBeInTheDocument()
    for (const highlight of populatedFixture.highlights!) {
      expect(screen.getByText(highlight)).toBeInTheDocument()
    }

    expect(screen.getByText('Related projects')).toBeInTheDocument()
    const related = screen.getByRole('list', { name: `${populatedFixture.title} projects` })
    expect(
      within(related).getByRole('link', { name: `${relatedFixture.name} — view project` }),
    ).toHaveAttribute('href', `/projects/${relatedFixture.slug}`)
  })

  it('treats an image supplied without alt text as decorative, never inventing alt text', () => {
    const { container } = renderDetail({ ...populatedFixture, imageAlt: undefined })
    const image = container.querySelector('img')
    expect(image).not.toBeNull()
    expect(image).toHaveAttribute('alt', '')
  })

  it('renders only the short description when nothing else is approved', () => {
    const bare: Service = {
      slug: 'bare',
      index: '01',
      category: 'villa',
      title: 'Bare',
      shortDescription: 'Only the verified line.',
    }
    renderDetail(bare)
    expect(screen.getByText('Only the verified line.')).toBeInTheDocument()
    expect(screen.queryByText('What we provide')).not.toBeInTheDocument()
    expect(screen.queryByText('Related projects')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('treats an empty highlights array the same as none', () => {
    renderDetail({ ...populatedFixture, highlights: [] })
    expect(screen.queryByText('What we provide')).not.toBeInTheDocument()
  })
})
