import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

/**
 * site.phone / site.whatsappNumber / site.closingImage are all unset in the
 * real app (see homepage-closing.test.tsx for that current, real state).
 * This file mocks src/data/site.ts, in isolation, purely to verify that the
 * homepage's Start a Project chapter and closing band pick those values up
 * correctly once the client confirms them. The fixture values are obviously
 * synthetic — never to be mistaken for real Visakram Builders details.
 */
const fixtureSite = {
  name: 'Visakram Builders',
  locality: 'Kommadi',
  city: 'Visakhapatnam',
  region: 'Andhra Pradesh',
  serviceAreas: ['Visakhapatnam', 'Vizianagaram'],
  values: ['Quality', 'Timeliness', 'Transparency'],
  stats: { yearsExperience: '20+', completedProjects: '25+', ongoingProjects: 5 },
  phones: ['+91 90000 00000'],
  phone: '+91 90000 00000',
  whatsappNumber: '+91 90000 00001',
  email: undefined as string | undefined,
  streetAddress: undefined as string | undefined,
  siteUrl: undefined as string | undefined,
  aboutImage: undefined as { src: string; alt: string } | undefined,
  closingImage: { src: '/test-fixture-closing.jpg', alt: 'Test fixture closing image, not real' },
} as const

vi.mock('../../src/data/site', () => ({ site: fixtureSite }))

async function renderHome() {
  const { App } = await import('../../src/app/App')
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

// the Start a Project chapter is kept but is not on the homepage, so it is rendered on its own
async function renderStart() {
  const { StartProjectSection } =
    await import('../../src/sections/home/StartProjectSection/StartProjectSection')
  return render(
    <MemoryRouter>
      <StartProjectSection />
    </MemoryRouter>,
  )
}

describe('homepage closing — once phone, WhatsApp and a closing image are confirmed', () => {
  it('offers the enquiry form, WhatsApp and Call as contact choices', async () => {
    await renderStart()
    const section = screen
      .getByRole('heading', { level: 2, name: 'Start your project.' })
      .closest('section') as HTMLElement
    const choices = within(section).getByRole('list', { name: 'Contact choices' })
    const links = within(choices).getAllByRole('link')
    expect(links).toHaveLength(3)

    expect(within(choices).getByRole('link', { name: /enquiry form/i })).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(
      within(choices).getByRole('link', { name: `Call ${fixtureSite.phone}` }),
    ).toHaveAttribute('href', 'tel:+919000000000')
  })

  it('builds a safe wa.me link — digits only, generic non-personal prefilled text', async () => {
    await renderStart()
    const section = screen
      .getByRole('heading', { level: 2, name: 'Start your project.' })
      .closest('section') as HTMLElement
    const whatsapp = within(section).getByRole('link', { name: /whatsapp/i })
    const url = new URL(whatsapp.getAttribute('href') as string)
    expect(url.origin + url.pathname).toBe('https://wa.me/919000000001')
    expect(url.searchParams.get('text')).toBe(
      "Hi, I'd like to start a project with Visakram Builders.",
    )
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(whatsapp.getAttribute('rel')).toMatch(/noopener/)
  })

  it('shows the closing image behind the statement', async () => {
    await renderHome()
    const section = screen
      .getByRole('heading', { level: 2, name: 'Let’s build what lasts.' })
      .closest('section') as HTMLElement
    const image = within(section).getByRole('img', { name: fixtureSite.closingImage.alt })
    expect(image).toHaveAttribute('src', fixtureSite.closingImage.src)
  })
})
