import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { homeSegments } from '../../src/data/homeSegments'
import { processSteps } from '../../src/data/process'
import { featuredProjectPreview } from '../../src/data/featuredProjectPreview'
import { projects } from '../../src/data/projects'
import { site } from '../../src/data/site'
import { visakramWayPrinciples } from '../../src/data/visakramWay'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage — what we build', () => {
  it('renders the section heading and the four segments, each with its tagline', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section')
    expect(section).not.toBeNull()
    const scoped = within(section as HTMLElement)
    expect(homeSegments.map((segment) => [segment.title, segment.tagline])).toEqual([
      ['Residential', 'Spaces to Live.'],
      ['Commercial', 'Spaces to Thrive.'],
      ['Mixed-use', 'Spaces to Connect.'],
      ['Hospitality', 'Spaces to Unwind.'],
    ])
    for (const segment of homeSegments) {
      const card = scoped
        .getByRole('heading', { level: 3, name: segment.title })
        .closest('li') as HTMLElement
      expect(within(card).getByText(segment.tagline)).toBeInTheDocument()
    }
  })

  it('makes each segment card an accessible link, not a generic card grid', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    for (const segment of homeSegments) {
      const link = scoped.getByRole('link', {
        name: new RegExp(`^${segment.title}, ${segment.tagline}`),
      })
      expect(link).toHaveAttribute('href', '/services')
    }
  })

  it('fills every card with media — a looping video for Residential, pictures for the rest and the featured project', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    // no visible placeholder note; the featured card is marked data-preview for audit instead
    expect(section.querySelector('[data-dev-placeholder]')).toBeNull()
    expect(section.querySelectorAll('li[data-preview]').length).toBeGreaterThan(0)
    // the real set: the copies that make the carousel loop are checked separately
    const real = section.querySelector('ul:not([data-copy])') as HTMLElement
    const rows = Array.from(real.querySelectorAll(':scope > li'))
    // the three segments, then the featured project
    expect(rows).toHaveLength(homeSegments.length + 1)

    const video = real.querySelector('video') as HTMLVideoElement
    expect(video).not.toBeNull()
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('autoplay')
    expect(video).not.toHaveAttribute('controls')
    const residential = homeSegments.find((segment) => segment.slug === 'residential')!
    expect(video).toHaveAttribute('src', residential.video!.src)

    const images = Array.from(real.querySelectorAll('img'))
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      ...homeSegments.flatMap((segment) => (segment.image ? [segment.image.src] : [])),
      featuredProjectPreview.image.src,
    ])
    for (const image of images) {
      expect(image.getAttribute('alt')).not.toBe('')
      expect(image).toHaveAttribute('loading', 'lazy')
    }
  })
})

describe('homepage — amenities', () => {
  it('lists the six client-supplied amenities, in order, right after What we build', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'Amenities.' })
    const section = heading.closest('section') as HTMLElement
    const items = within(section)
      .getAllByRole('listitem')
      .map((li) => li.textContent)
    expect(items).toEqual([
      'Lift',
      'Car parking',
      'Generator',
      'CCTV',
      'EV Charging point',
      'Security guard room',
    ])
    expect(section.previousElementSibling?.id).toBe('what-we-build')
  })
})

describe('homepage — what we build carousel', () => {
  it('drifts the cards as a loop whose copies are hidden from assistive tech and cannot be tabbed to', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const sets = Array.from(section.querySelectorAll('ul'))
    expect(sets.length).toBeGreaterThanOrEqual(4)
    const [real, ...copies] = sets
    expect(real).not.toHaveAttribute('aria-hidden')
    expect(real).not.toHaveAttribute('inert')
    for (const copy of copies) {
      expect(copy).toHaveAttribute('aria-hidden', 'true')
      expect(copy).toHaveAttribute('inert')
    }
    // every copy is the same set of cards
    for (const set of sets)
      expect(set.querySelectorAll(':scope > li')).toHaveLength(homeSegments.length + 1)
    // only the real set is exposed: one h3 and one link per card (the segments and the featured project)
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(
      homeSegments.length + 1,
    )
    expect(within(section).getAllByRole('link')).toHaveLength(homeSegments.length + 1)
    expect(
      within(section).getByRole('heading', { level: 3, name: 'Featured projects' }),
    ).toBeInTheDocument()
  })
})

describe('homepage — what we build carousel controls', () => {
  it('has previous, pause and next controls, and pause / play holds the drift', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const { container } = renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    expect(scoped.getByRole('button', { name: 'Previous card' })).toBeInTheDocument()
    expect(scoped.getByRole('button', { name: 'Next card' })).toBeInTheDocument()
    const carousel = container.querySelector(
      '#what-we-build [data-paused], #what-we-build > div:last-child',
    ) as HTMLElement
    expect(carousel).not.toHaveAttribute('data-paused')
    const user = userEvent.setup()
    await user.click(scoped.getByRole('button', { name: 'Pause carousel' }))
    expect(carousel).toHaveAttribute('data-paused', 'true')
    const play = scoped.getByRole('button', { name: 'Play carousel' })
    expect(play).toHaveAttribute('aria-pressed', 'true')
    await user.click(play)
    expect(carousel).not.toHaveAttribute('data-paused')
  })
})

describe('homepage — featured project', () => {
  it('is a card in the What We Build carousel, not a section of its own, and shows the sample preview while none is verified', () => {
    expect(projects).toHaveLength(0)
    renderHome()
    // no section of its own any more
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Featured project.' }),
    ).not.toBeInTheDocument()
    expect(document.getElementById('featured-project')).toBeNull()

    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    const card = scoped
      .getByRole('heading', { level: 3, name: 'Featured projects' })
      .closest('li') as HTMLElement
    expect(card).toHaveAttribute('data-preview', 'true')
    expect(within(card).getByText(new RegExp(featuredProjectPreview.name))).toBeInTheDocument()
    expect(card.querySelector('img')).toHaveAttribute('src', featuredProjectPreview.image.src)
    expect(within(card).getByRole('link')).toHaveAttribute('href', '/projects')
    // nothing is shown that presents the sample as a real project, and nothing visibly flagged
    expect(card.querySelector('[data-dev-placeholder]')).toBeNull()
  })
})

describe('homepage — the Visakram way', () => {
  it('renders exactly the three verified company values, in order, with no invented fourth value', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'The Visakram Way' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    const itemHeadings = scoped.getAllByRole('heading', { level: 3 })
    expect(itemHeadings.map((el) => el.textContent)).toEqual([...site.values])
    for (const principle of visakramWayPrinciples) {
      expect(scoped.getByText(principle.description)).toBeInTheDocument()
    }
  })
})

describe('homepage — our story', () => {
  it('renders the client-supplied story right after the From Plan to Place section', () => {
    renderHome()
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'The Story Beneath Every Landmark.',
    })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    expect(scoped.getByText('Turning Land into Legacy.')).toBeInTheDocument()
    expect(scoped.getByText(/Every piece of land holds a possibility/)).toBeInTheDocument()
    expect(scoped.getByText(/Rooted in Andhra Pradesh/)).toBeInTheDocument()
    expect(scoped.getByText(/We build what it can become/)).toBeInTheDocument()
    // it directly follows the From Plan to Place section
    const previous = section.previousElementSibling
    expect(previous?.id).toBe('from-plan-to-place')
  })
})

describe('homepage — how we build', () => {
  it('renders the five approved process steps, in order', () => {
    renderHome()
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'The Method Behind the Masterpiece.',
    })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    const stepHeadings = scoped.getAllByRole('heading', { level: 3 })
    expect(stepHeadings.map((el) => el.textContent)).toEqual(processSteps.map((s) => s.title))
    for (const step of processSteps) {
      expect(scoped.getByText(step.description)).toBeInTheDocument()
    }
  })
})

describe('homepage — navigation still works alongside the new chapters', () => {
  it('keeps the header nav and skip link intact', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getAllByRole('link', { name: 'Services' }).length).toBeGreaterThan(0)
  })
})
