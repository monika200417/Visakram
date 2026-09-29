import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { services } from '../../src/data/services'
import { processSteps } from '../../src/data/process'
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
  it('renders the section heading and all three categories as headings', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section')
    expect(section).not.toBeNull()
    const scoped = within(section as HTMLElement)
    for (const category of services) {
      expect(scoped.getByRole('heading', { level: 3, name: category.title })).toBeInTheDocument()
    }
  })

  it('makes each category row an accessible link, not a generic card grid', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    for (const category of services) {
      const link = scoped.getByRole('link', { name: new RegExp(category.title) })
      expect(link).toHaveAttribute('href', '/services')
    }
  })

  it('marks category imagery as a development placeholder', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'What we build.' })
    const section = heading.closest('section') as HTMLElement
    expect(section.querySelectorAll('[data-dev-placeholder]').length).toBeGreaterThanOrEqual(
      services.length,
    )
  })
})

describe('homepage — featured project', () => {
  it('does not fabricate a project while none is verified', () => {
    expect(projects).toHaveLength(0)
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'Featured project.' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)
    expect(scoped.getByText(/awaiting a client-approved project/i)).toBeInTheDocument()
    expect(section.querySelector('[data-dev-placeholder]')).not.toBeNull()
    // No project h3 is rendered when there is no real project to name.
    expect(scoped.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
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

describe('homepage — how we build', () => {
  it('renders the five approved process steps, in order', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 2, name: 'How we build.' })
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
