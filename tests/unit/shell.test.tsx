import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'

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

  it('renders the footer without inventing unverified contact details', () => {
    renderAt('/')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText(/visakram builders/i)).toBeInTheDocument()
    expect(within(footer).getByText('Kommadi, Visakhapatnam')).toBeInTheDocument()
    // Phone/email are undefined in src/data/site.ts until verified — must not appear.
    expect(within(footer).queryByRole('link', { name: /tel:/i })).not.toBeInTheDocument()
    expect(within(footer).queryByText(/@/)).not.toBeInTheDocument()
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
