import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { expectOnlyVerifiedContactLinks } from '../helpers/contactLinks'
import { ProcessJourney } from '../../src/components/process/ProcessJourney'
import { primaryCta } from '../../src/data/navigation'
import { processSteps, type ProcessStep } from '../../src/data/process'
import { site } from '../../src/data/site'
import { toAnchorId } from '../../src/utils/anchorId'

function renderProcess() {
  return render(
    <MemoryRouter initialEntries={['/process']}>
      <App />
    </MemoryRouter>,
  )
}

describe('process page', () => {
  it('renders exactly one h1 with no skipped heading levels', () => {
    renderProcess()
    expect(
      screen.getByRole('heading', { level: 1, name: 'From consult to handover.' }),
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

  it('derives its heading from the approved first and last step, not hardcoded copy', () => {
    renderProcess()
    const first = processSteps[0]!.title.toLowerCase()
    const last = processSteps[processSteps.length - 1]!.title.toLowerCase()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`From ${first} to ${last}.`)
  })

  it('has no placeholder content left', () => {
    renderProcess()
    expect(screen.queryByText(/Development placeholder/)).not.toBeInTheDocument()
  })

  it('builds the overview from process.ts — every step, in order, linking to its stage', () => {
    renderProcess()
    const nav = screen.getByRole('navigation', { name: 'Process stages' })
    const links = within(nav).getAllByRole('link')
    expect(processSteps).toHaveLength(5)
    expect(links).toHaveLength(processSteps.length)
    processSteps.forEach((step, i) => {
      expect(links[i]).toHaveAttribute('href', `#${toAnchorId(step.title)}`)
      expect(within(links[i]!).getByText(step.title)).toBeInTheDocument()
      expect(within(links[i]!).getByText(step.index)).toBeInTheDocument()
    })
  })

  it('renders one journey stage per step with its exact approved title and description', () => {
    const { container } = renderProcess()
    for (const step of processSteps) {
      const stage = container.querySelector(`li#${toAnchorId(step.title)}`) as HTMLElement
      expect(stage).not.toBeNull()
      const scoped = within(stage)
      expect(scoped.getByRole('heading', { level: 3, name: step.title })).toBeInTheDocument()
      expect(scoped.getByText(step.description)).toBeInTheDocument()
      expect(
        scoped.getByText(`Stage ${step.index} of ${String(processSteps.length).padStart(2, '0')}`),
      ).toBeInTheDocument()
    }
  })

  it('shows the finished journey by default: no stage is marked pending before scripts run', () => {
    const { container } = renderProcess()
    const stages = container.querySelectorAll('[data-stage]')
    expect(stages).toHaveLength(processSteps.length)
    stages.forEach((stage) => expect(stage).not.toHaveAttribute('data-state', 'pending'))
  })

  it('invents no durations, guarantees or statistics beyond the approved data', () => {
    const { container } = renderProcess()
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/\b(days?|weeks?|months?)\b/i)
    expect(text).not.toMatch(/guarantee|warranty|certified|award/i)
  })

  it('offers the primary CTA and a path to services, with no invented contact details', () => {
    renderProcess()
    const ctaHeading = screen.getByRole('heading', {
      level: 2,
      name: 'Let’s Create a Lasting Legacy.',
    })
    const section = ctaHeading.closest('section') as HTMLElement
    expect(within(section).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    expect(within(section).getByRole('link', { name: 'Explore services' })).toHaveAttribute(
      'href',
      '/services',
    )
    expectOnlyVerifiedContactLinks()
  })

  it('sets the SEO-SPEC title and a description built from the approved steps and service area', () => {
    renderProcess()
    expect(document.title).toBe(`Our Construction Process | ${site.name}`)
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description).toContain(site.name)
    for (const step of processSteps) expect(description).toContain(step.title)
    for (const area of site.serviceAreas) expect(description).toContain(area)
    // site.siteUrl is unconfirmed, so no canonical is invented.
    expect(document.querySelector('link[rel="canonical"]')).toBeNull()
  })

  it('renders every section synchronously, independent of animation state', () => {
    renderProcess()
    expect(screen.getByRole('heading', { level: 2, name: 'The sequence.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Stage by stage.' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Let’s Create a Lasting Legacy.' }),
    ).toBeInTheDocument()
  })
})

describe('ProcessJourney', () => {
  it('renders nothing at all when there are no steps — no empty list, line or heading', () => {
    const { container } = render(<ProcessJourney steps={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders exactly the steps it is given, in order, and derives the total from them', () => {
    const steps: ProcessStep[] = [
      { index: '01', title: 'Test Fixture One', description: 'Test fixture description one.' },
      { index: '02', title: 'Test Fixture Two', description: 'Test fixture description two.' },
    ]
    render(<ProcessJourney steps={steps} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]!).getByRole('heading', { name: 'Test Fixture One' })).toBeVisible()
    expect(within(items[1]!).getByRole('heading', { name: 'Test Fixture Two' })).toBeVisible()
    expect(screen.getByText('Stage 02 of 02')).toBeInTheDocument()
    expect(items[1]).toHaveAttribute('id', 'test-fixture-two')
  })
})

describe('anchor ids', () => {
  it('derives stable, url-safe ids from titles', () => {
    expect(toAnchorId('Quality')).toBe('quality')
    expect(toAnchorId('  Plan & Prepare! ')).toBe('plan-prepare')
  })
})
