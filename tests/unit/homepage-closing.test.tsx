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

function renderStart() {
  return render(
    <MemoryRouter>
      <StartProjectSection />
    </MemoryRouter>,
  )
}

describe('homepage closing — Chapters 12 and 14', () => {
  it('renders both chapters as h2s, after Testimonials and in order', () => {
    renderHome()
    const stories = screen.getByRole('heading', { level: 2, name: 'What our clients say.' })
    const local = screen.getByRole('heading', { level: 2, name: /^Building Across/ })
    const closing = screen.getByRole('heading', { level: 2, name: 'Let’s build what lasts.' })

    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
    expect(follows(stories, local)).toBe(true)
    expect(follows(local, closing)).toBe(true)
    // the Start a Project chapter is not on the homepage
    expect(screen.queryByRole('heading', { name: 'Start your project.' })).not.toBeInTheDocument()

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
    for (const heading of [/^Building Across/, 'Let’s build what lasts.']) {
      const el = section(heading)
      expect(el.querySelector('[data-dev-placeholder]')).toBeNull()
      expect(el.textContent).not.toMatch(/pending|awaiting|placeholder|lorem/i)
    }
  })
})

describe('Chapter 12 — Local Presence', () => {
  it('shows only the client-supplied statement, without the base or the area list', () => {
    renderHome()
    const el = section(/^Building Across/)
    const scoped = within(el)

    expect(
      scoped.getByRole('heading', { level: 2, name: 'Building Across Andhra Pradesh.' }),
    ).toBeInTheDocument()
    expect(scoped.getByText(/Driven by visionary development/)).toBeInTheDocument()
    expect(
      scoped.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent?.includes('how Andhra Pradesh lives, works, and grows') === true,
      ),
    ).toBeInTheDocument()
    // the earlier base-and-areas panel is gone
    expect(scoped.queryAllByRole('listitem')).toHaveLength(0)
    expect(scoped.queryByText(site.locality)).not.toBeInTheDocument()
    expect(el.textContent).not.toMatch(/Kommadi|Vizianagaram/)
  })

  it('invents no map, distance, office, branch or per-area figure', () => {
    renderHome()
    const el = section(/^Building Across/)
    expect(within(el).queryAllByRole('img')).toHaveLength(0)
    expect(el.querySelector('canvas, iframe')).toBeNull()
    // the only drawing is the decorative arrow between the heading and the statement
    expect(
      Array.from(el.querySelectorAll('svg')).every(
        (svg) => svg.getAttribute('aria-hidden') === 'true',
      ),
    ).toBe(true)
    expect(el.textContent).not.toMatch(/\bkm\b|miles?|minutes?|office|branch|headquarter/i)
    expect(el.textContent ?? '').not.toMatch(/\d/)
  })
})

describe('Chapter 13 — Start a Project (section kept, not on the homepage)', () => {
  it('uses the existing primary CTA into the existing contact experience', () => {
    renderStart()
    const el = section('Start your project.')
    expect(within(el).getByRole('link', { name: primaryCta.label })).toHaveAttribute(
      'href',
      primaryCta.to,
    )
    expect(within(el).getByText(new RegExp(site.serviceAreas.join(' and ')))).toBeInTheDocument()
    // it points to the form rather than duplicating it
    expect(el.querySelector('form, input, textarea, select')).toBeNull()
  })

  it('offers the first supplied phone number and WhatsApp on it — and no broken links', () => {
    renderStart()
    const el = section('Start your project.')
    expect(site.whatsappNumber).toBe(site.phone)
    for (const link of within(el).getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      if (href.includes('wa.me')) expect(href).toMatch(/^https:\/\/wa\.me\/919515452875/)
      expect(href).not.toMatch(/undefined|null/)
    }
    expect(within(el).getByRole('link', { name: `Call ${site.phone}` })).toBeInTheDocument()
  })

  it('makes no price, budget, response-time or availability claim', () => {
    renderStart()
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
