import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { loadGsap } from '../../src/animations/gsap'
import { ClosingSection } from '../../src/sections/home/ClosingSection/ClosingSection'
import { LocalPresenceSection } from '../../src/sections/home/LocalPresenceSection/LocalPresenceSection'
import { StartProjectSection } from '../../src/sections/home/StartProjectSection/StartProjectSection'
import { primaryCta } from '../../src/data/navigation'
import { site } from '../../src/data/site'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function section(name: string | RegExp) {
  return screen.getByRole('heading', { level: 2, name }).closest('section') as HTMLElement
}

describe('homepage closing — Chapters 12, 13 and 14', () => {
  it('renders all three chapters as h2s, after Customer Stories and in order', () => {
    renderHome()
    const stories = screen.getByRole('heading', { level: 2, name: 'Customer stories.' })
    const local = screen.getByRole('heading', { level: 2, name: /^Building across/ })
    const start = screen.getByRole('heading', { level: 2, name: 'Start your project.' })
    const closing = screen.getByRole('heading', { level: 2, name: 'Let’s build what lasts.' })

    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
    expect(follows(stories, local)).toBe(true)
    expect(follows(local, start)).toBe(true)
    expect(follows(start, closing)).toBe(true)

    // still exactly one h1 on the page, and no heading level skipped by the new chapters
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('ends the page on the closing chapter, flush against the footer', () => {
    const { container } = renderHome()
    const main = container.querySelector('main') as HTMLElement
    const last = main.lastElementChild as HTMLElement
    expect(last).toBe(section('Let’s build what lasts.'))
    expect(last).toHaveAttribute('data-flush-footer')
    expect(main.nextElementSibling?.tagName).toBe('FOOTER')
  })

  it('leaves no placeholder text or dev markers in the new chapters', () => {
    renderHome()
    for (const heading of [/^Building across/, 'Start your project.', 'Let’s build what lasts.']) {
      const el = section(heading)
      expect(el.querySelector('[data-dev-placeholder]')).toBeNull()
      expect(el.textContent).not.toMatch(/pending|awaiting|placeholder|lorem/i)
    }
  })
})

describe('Chapter 12 — Local Presence', () => {
  it('states the verified base and service areas from site.ts, and nothing more', () => {
    renderHome()
    const el = section(/^Building across/)
    const scoped = within(el)

    expect(scoped.getByText('12 — Local Presence')).toBeInTheDocument()
    expect(
      scoped.getByRole('heading', {
        level: 2,
        name: `Building across ${site.serviceAreas.join(' and ')}.`,
      }),
    ).toBeInTheDocument()
    expect(scoped.getByText(`${site.locality}, ${site.city}`)).toBeInTheDocument()
    expect(scoped.getByText(site.region)).toBeInTheDocument()

    const areas = scoped.getAllByRole('listitem').map((li) => li.textContent)
    expect(areas).toEqual(site.serviceAreas.map((area, i) => `0${i + 1}${area}`))
  })

  it('invents no map, distance, office, branch or per-area figure', () => {
    renderHome()
    const el = section(/^Building across/)
    expect(within(el).queryAllByRole('img')).toHaveLength(0)
    expect(el.querySelector('svg, canvas, iframe')).toBeNull()
    expect(el.textContent).not.toMatch(/\bkm\b|miles?|minutes?|office|branch|headquarter/i)
    // the only digits are the 01/02 list indexes and the "12" chapter number
    expect((el.textContent ?? '').replace(/12 — Local Presence|0[12]/g, '')).not.toMatch(/\d/)
  })
})

describe('Chapter 13 — Start a Project', () => {
  it('uses the existing primary CTA into the existing contact experience', () => {
    renderHome()
    const el = section('Start your project.')
    expect(within(el).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    expect(within(el).getByText(new RegExp(site.serviceAreas.join(' and ')))).toBeInTheDocument()
    // it points to the form rather than duplicating it
    expect(el.querySelector('form, input, textarea, select')).toBeNull()
  })

  it('shows no phone, WhatsApp or email channel while those are unverified — and no broken links', () => {
    renderHome()
    const el = section('Start your project.')
    expect(site.phone).toBeUndefined()
    expect(site.whatsappNumber).toBeUndefined()
    expect(within(el).queryByRole('list', { name: 'Contact choices' })).not.toBeInTheDocument()
    for (const link of within(el).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(href).not.toMatch(/^(tel:|mailto:|https:\/\/wa\.me)/)
      expect(href).not.toMatch(/undefined|null/)
    }
  })

  it('makes no price, budget, response-time or availability claim', () => {
    renderHome()
    const text = section('Start your project.').textContent ?? ''
    expect(text).not.toMatch(
      /₹|\brs\.?\b|price|pricing|budget|free\b|quote|within|hours?|respond|reply|available|guarantee/i,
    )
  })
})

describe('Chapter 14 — Cinematic Closing', () => {
  it('renders the statement and the primary CTA with no media available', () => {
    renderHome()
    const el = section('Let’s build what lasts.')
    expect(site.closingImage).toBeUndefined()
    expect(within(el).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    expect(within(el).queryAllByRole('img')).toHaveLength(0)
    expect(el.querySelector('video, picture, source')).toBeNull()
  })

  it('shows a supplied closing image behind the statement, with its own alt text', () => {
    render(
      <MemoryRouter>
        <ClosingSection
          image={{ src: '/test-fixture-closing.jpg', alt: 'Test fixture, not real' }}
        />
      </MemoryRouter>,
    )
    const image = screen.getByRole('img', { name: 'Test fixture, not real' })
    expect(image).toHaveAttribute('src', '/test-fixture-closing.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
    // the statement stays real text over it
    expect(screen.getByRole('heading', { level: 2, name: 'Let’s build what lasts.' })).toBeVisible()
  })
})

describe('reduced motion', () => {
  const original = window.matchMedia

  function setReducedMotion(reduced: boolean) {
    window.matchMedia = ((query: string) => ({
      matches: reduced ? /reduce/.test(query) : /no-preference/.test(query),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
  }

  afterEach(() => {
    window.matchMedia = original
  })

  async function settle() {
    await loadGsap()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  function renderChapters() {
    return render(
      <MemoryRouter>
        <LocalPresenceSection />
        <StartProjectSection />
        <ClosingSection />
      </MemoryRouter>,
    )
  }

  const revealTargets = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('h2')).map((h2) => {
      // the reveal is applied to the block that wraps each chapter's content
      let node = h2.parentElement as HTMLElement
      while (node && !node.style.opacity && node.parentElement?.tagName !== 'SECTION') {
        node = node.parentElement as HTMLElement
      }
      return node
    })

  it('shows every chapter fully, immediately, when reduced motion is requested', async () => {
    setReducedMotion(true)
    const { container } = renderChapters()
    await settle()
    const targets = revealTargets(container)
    expect(targets).toHaveLength(3)
    for (const target of targets) expect(target.style.opacity).toBe('1')
    expect(screen.getByRole('heading', { name: 'Let’s build what lasts.' })).toBeVisible()
  })

  it('only runs the reveal when motion is allowed — and the text is in the DOM regardless', async () => {
    setReducedMotion(false)
    const { container } = renderChapters()
    await settle()
    // jsdom has no layout, so the trigger fires at once: the chapter is mid-reveal, not at rest
    for (const target of revealTargets(container)) {
      expect(Number(target.style.opacity)).toBeLessThan(1)
    }
    // content is real HTML either way: nothing depends on the animation to exist
    expect(screen.getByRole('heading', { name: 'Start your project.' })).toBeInTheDocument()
  })
})
