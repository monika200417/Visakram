import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { site } from '../../src/data/site'
import { telHref } from '../../src/utils/telHref'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('global shell', () => {
  it('renders the header with the brand mark and primary navigation', () => {
    renderAt('/')
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: /visakram builders/i })).toBeInTheDocument()

    const primaryNav = screen.getByRole('navigation', { name: 'Primary' })
    for (const label of ['Projects', 'Services', 'About', 'Process', 'Contact']) {
      expect(within(primaryNav).getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(within(header).getByRole('link', { name: 'Start a Project' })).toBeInTheDocument()
  })

  it('renders the footer with the client-supplied phone numbers and email, and nothing else', () => {
    renderAt('/')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText(/visakram builders/i)).toBeInTheDocument()
    expect(within(footer).getByText('Building across')).toBeInTheDocument()
    expect(within(footer).getAllByText('Andhra Pradesh').length).toBeGreaterThan(0)
    // the supplied office address, with its PIN code
    expect(within(footer).getByText('Office address')).toBeInTheDocument()
    expect(
      within(footer).getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent?.includes('Kommadi, Visakhapatnam, Andhra Pradesh - 530048') === true,
      ),
    ).toBeInTheDocument()
    expect(footer.textContent).not.toMatch(/Vizianagaram/)
    for (const phone of site.phones) {
      expect(within(footer).getByRole('link', { name: phone })).toHaveAttribute(
        'href',
        telHref(phone),
      )
    }
    expect(within(footer).getByRole('link', { name: site.email as string })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    )
    expect(within(footer).queryByRole('link', { name: /whatsapp/i })).not.toBeInTheDocument()
  })

  it('keeps the skip link as the first focusable element', () => {
    renderAt('/')
    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink).toHaveAttribute('href', '#main')
  })

  it('opens and closes the mobile menu with correct aria state', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile' })
    expect(within(mobileNav).getByRole('link', { name: 'Projects' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('does not duplicate the h1 across pages with the shell mounted', () => {
    renderAt('/services')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})

describe('footer credit', () => {
  it('credits Samify with a safe external link and a call to action', () => {
    renderAt('/')
    const footer = screen.getByRole('contentinfo')
    const link = within(footer).getByRole('link', { name: /powered by samify/i })
    expect(link).toHaveAttribute('href', 'https://samify.co.in/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(within(footer).getByText('samify.co.in')).toBeInTheDocument()
    expect(within(footer).getByText(/visit samify to build your website/i)).toBeInTheDocument()
  })
})
