import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

/**
 * site.phone / site.whatsappNumber / site.email are all unverified and
 * undefined in the real app (see contact-page.test.tsx for that current,
 * real state). This file mocks src/data/site.ts, in isolation, purely to
 * verify the *architecture* that renders the Direct Contact section and
 * builds the WhatsApp link actually works once real values are confirmed.
 * The fixture values below are obviously synthetic test fixtures, never
 * to be mistaken for real Visakram Builders contact details.
 */
const fixtureSite = {
  name: 'Visakram Builders',
  locality: 'Kommadi',
  city: 'Visakhapatnam',
  region: 'Andhra Pradesh',
  serviceAreas: ['Visakhapatnam', 'Vizianagaram'],
  values: ['Quality', 'Timeliness', 'Transparency'],
  stats: { yearsExperience: '20+', completedProjects: '25+', ongoingProjects: 5 },
  phone: '+91 90000 00000',
  whatsappNumber: '+91 90000 00001',
  email: 'test-fixture@example.invalid',
  streetAddress: undefined as string | undefined,
  siteUrl: undefined as string | undefined,
  aboutImage: undefined as { src: string; alt: string } | undefined,
} as const

vi.mock('../../src/data/site', () => ({ site: fixtureSite }))

async function renderContact() {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <App />
    </MemoryRouter>,
  )
}

describe('contact page — once phone/WhatsApp/email are confirmed', () => {
  it('renders a "Reach Us Directly" section with all three channels', async () => {
    await renderContact()
    const heading = screen.getByRole('heading', { name: 'Prefer to talk directly?' })
    const section = heading.closest('section') as HTMLElement
    const scoped = within(section)

    expect(scoped.getByRole('link', { name: `Call ${fixtureSite.phone}` })).toHaveAttribute(
      'href',
      `tel:${fixtureSite.phone}`,
    )
    expect(scoped.getByRole('link', { name: `Email ${fixtureSite.email}` })).toHaveAttribute(
      'href',
      `mailto:${fixtureSite.email}`,
    )
    expect(scoped.getByRole('link', { name: /message us on whatsapp/i })).toBeInTheDocument()
  })

  it('builds a safe wa.me link — digits only, generic non-personal prefilled text', async () => {
    await renderContact()
    const link = screen.getByRole('link', { name: /message us on whatsapp/i })
    const href = link.getAttribute('href')!
    expect(href.startsWith('https://wa.me/919000000001')).toBe(true)
    // No form field value (name/phone/location/message the visitor typed)
    // ever appears in this URL — only a fixed, generic statement.
    const decoded = decodeURIComponent(href)
    expect(decoded).toContain(`start a project with ${fixtureSite.name}`)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('blocked submission still offers to reach out directly when a channel exists', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const { services } = await import('../../src/data/services')
    await renderContact()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^Name/), 'Test Fixture Visitor')
    await user.type(screen.getByLabelText(/^Phone/), '+91 98765 43210')
    await user.selectOptions(screen.getByLabelText(/^Project type/), services[0]!.title)
    await user.type(screen.getByLabelText(/^Location/), 'Test Fixture Location')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(
      await screen.findByText(/reach out directly using the contact details on this page/i),
    ).toBeInTheDocument()
  })
})
