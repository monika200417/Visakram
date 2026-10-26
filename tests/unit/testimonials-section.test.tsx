import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { clientTestimonials, initialsOf } from '../../src/data/clientTestimonials'

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function getSection() {
  const heading = screen.getByRole('heading', { level: 2, name: 'What our clients say.' })
  return heading.closest('section') as HTMLElement
}

describe('testimonials data (preview content)', () => {
  it('carries the five Visakram projects by name and locality, plus invented preview cards', () => {
    const real = clientTestimonials.filter((item) => item.real)
    expect(real.map((item) => `${item.project} — ${item.location}`)).toEqual([
      'Vasudha Enclave — Old Dairy Farm',
      'DH Enclave — Madhurawada',
      'MK Royal — Kommadi',
      'DMK RK Towers — Adarsh Nagar',
      'Dolphin Heights — Arilova',
    ])
    expect(clientTestimonials.length).toBeGreaterThanOrEqual(6)
    expect(clientTestimonials.some((item) => !item.real)).toBe(true)
  })

  it('gives every card the fields the layout needs, with a photograph that ships', () => {
    for (const item of clientTestimonials) {
      expect(item.name, item.id).not.toBe('')
      expect(item.designation, item.id).not.toBe('')
      expect(item.headline, item.id).not.toBe('')
      expect(item.feedback.length, item.id).toBeGreaterThan(60)
      expect(item.rating).toBeGreaterThanOrEqual(1)
      expect(item.rating).toBeLessThanOrEqual(5)
      expect(item.image.alt, item.id).not.toBe('')
      expect(existsSync(resolve(__dirname, '../../public', item.image.src.slice(1))), item.id).toBe(
        true,
      )
    }
  })

  it('makes a two-letter monogram, ignoring titles', () => {
    expect(initialsOf('Dr. Kiran Patnaik')).toBe('KP')
    expect(initialsOf('Sowmya Nair')).toBe('SN')
    expect(initialsOf('Sample Client')).toBe('SC')
    expect(initialsOf('Madonna')).toBe('M')
  })
})

describe('homepage — testimonials section', () => {
  it('renders the heading, a sub-caption and every card with its details', () => {
    renderHome()
    const section = getSection()
    const scoped = within(section)
    expect(scoped.getByText(/words from the families and owners/i)).toBeInTheDocument()
    // the first set is exposed to assistive tech; the repeat that makes the loop seamless is not
    const exposed = Array.from(section.querySelectorAll('[data-marquee-card]:not([aria-hidden])'))
    const hidden = Array.from(section.querySelectorAll('[data-marquee-card][aria-hidden="true"]'))
    expect(exposed).toHaveLength(clientTestimonials.length)
    expect(hidden).toHaveLength(clientTestimonials.length)
    clientTestimonials.forEach((item, i) => {
      const text = exposed[i]!.textContent ?? ''
      expect(text).toContain(item.name)
      expect(text).toContain(item.designation)
      expect(text).toContain(item.headline)
      expect(text).toContain(item.feedback)
      expect(text).toContain(item.project)
      expect(text).toContain(item.location)
      expect(text).toContain(item.buildType)
      expect(
        exposed[i]!.querySelector(`[aria-label="Rated ${item.rating} out of 5"]`),
      ).not.toBeNull()
    })
  })

  it('labels the carousel and its controls for assistive tech', () => {
    renderHome()
    const section = getSection()
    const scoped = within(section)
    const region = scoped.getByRole('region', { name: 'Client testimonials' })
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')
    expect(scoped.getByRole('button', { name: 'Previous testimonial' })).toBeInTheDocument()
    expect(scoped.getByRole('button', { name: 'Next testimonial' })).toBeInTheDocument()
    expect(scoped.getByRole('button', { name: 'Pause testimonials auto-scroll' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('lets the visitor stop and restart the auto-scroll with a button', () => {
    renderHome()
    const scoped = within(getSection())
    fireEvent.click(scoped.getByRole('button', { name: 'Pause testimonials auto-scroll' }))
    const play = scoped.getByRole('button', { name: 'Play testimonials auto-scroll' })
    expect(play).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(play)
    expect(
      scoped.getByRole('button', { name: 'Pause testimonials auto-scroll' }),
    ).toBeInTheDocument()
  })

  it('steps with the arrows without throwing', () => {
    renderHome()
    const scoped = within(getSection())
    fireEvent.click(scoped.getByRole('button', { name: 'Next testimonial' }))
    fireEvent.click(scoped.getByRole('button', { name: 'Previous testimonial' }))
  })

  it('shows no visible preview note, and marks the sample content data-preview for audit', () => {
    renderHome()
    const section = getSection()
    expect(
      within(section).queryByText(/sample reviews and stock photographs/i),
    ).not.toBeInTheDocument()
    expect(section.querySelector('[data-dev-placeholder]')).toBeNull()
    expect(section).toHaveAttribute('data-preview', 'true')
  })

  it('keeps the page outline intact: one h1, no skipped levels', () => {
    renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    let deepest = 1
    for (const heading of screen.getAllByRole('heading')) {
      const level = Number(heading.tagName[1])
      expect(level).toBeLessThanOrEqual(deepest + 1)
      deepest = Math.max(deepest, level)
    }
  })
})
