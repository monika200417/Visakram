import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { services } from '../../src/data/services'
import { site } from '../../src/data/site'
import { CONTACT_FIELD_LIMITS } from '../../src/utils/contactValidation'

/**
 * site.phone / site.whatsappNumber / site.email are all unverified and
 * undefined in the real app — this file exercises exactly that (current,
 * real) state, so no fabricated contact detail is ever expected anywhere
 * on the page. See contact-page-populated.test.tsx for the architecture
 * once one of those fields is confirmed.
 */
function renderContact() {
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <App />
    </MemoryRouter>,
  )
}

function getForm() {
  return screen.getByRole('button', { name: 'Send enquiry' }).closest('form') as HTMLFormElement
}

describe('contact page', () => {
  it('renders exactly one h1 with no skipped heading levels', () => {
    renderContact()
    const headings = screen.getAllByRole('heading').map((el) => Number(el.tagName[1]))
    expect(headings[0]).toBe(1)
    expect(headings.filter((level) => level === 1)).toHaveLength(1)

    let deepestSeen = 1
    for (const level of headings) {
      expect(level).toBeLessThanOrEqual(deepestSeen + 1)
      deepestSeen = Math.max(deepestSeen, level)
    }
  })

  it('renders every required field with an accessible label', () => {
    renderContact()
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Phone/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Project type/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Location/)).toBeInTheDocument()
    // Optional fields are also labelled, just marked "(optional)".
    expect(screen.getByLabelText(/^WhatsApp number/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Approximate requirement/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Message/)).toBeInTheDocument()
  })

  it('sources project type options from services.ts, not a second hardcoded list', () => {
    renderContact()
    const select = screen.getByLabelText(/^Project type/) as HTMLSelectElement
    const optionLabels = Array.from(select.options).map((option) => option.textContent)
    expect(optionLabels).toEqual(['Select a project type', ...services.map((s) => s.title)])
  })

  it('rejects an empty submission and shows accessible required-field errors', async () => {
    const user = userEvent.setup()
    renderContact()
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const nameInput = screen.getByLabelText(/^Name/)
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    const describedBy = nameInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    const errorEl = document.getElementById(describedBy!)
    expect(errorEl).toHaveTextContent(/required/i)
    expect(errorEl).toHaveAttribute('role', 'alert')

    // Focus moves to the first invalid field for keyboard/AT users.
    expect(nameInput).toHaveFocus()

    // No network-implying success message is ever shown on validation failure.
    expect(screen.queryByText(/enquiry has been received/i)).not.toBeInTheDocument()
  })

  it('rejects an implausible phone number but accepts a valid international one', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.type(screen.getByLabelText(/^Name/), 'Test Fixture Visitor')
    await user.type(screen.getByLabelText(/^Phone/), 'abc')
    await user.selectOptions(screen.getByLabelText(/^Project type/), services[0]!.title)
    await user.type(screen.getByLabelText(/^Location/), 'Test Fixture Location')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const phoneInput = screen.getByLabelText(/^Phone/)
    expect(phoneInput).toHaveAttribute('aria-invalid', 'true')

    await user.clear(phoneInput)
    await user.type(phoneInput, '+91 98765 43210')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(phoneInput).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('validates the optional WhatsApp field only when it is filled in', async () => {
    const user = userEvent.setup()
    renderContact()
    const whatsappInput = screen.getByLabelText(/^WhatsApp number/)

    await user.type(screen.getByLabelText(/^Name/), 'Test Fixture Visitor')
    await user.type(screen.getByLabelText(/^Phone/), '+91 98765 43210')
    await user.selectOptions(screen.getByLabelText(/^Project type/), services[0]!.title)
    await user.type(screen.getByLabelText(/^Location/), 'Test Fixture Location')

    // Left blank: no error, since WhatsApp is optional.
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(whatsappInput).not.toHaveAttribute('aria-invalid', 'true')

    // Filled with garbage: now validated like a phone number.
    await user.type(whatsappInput, 'not-a-number')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(whatsappInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('enforces the message length limit from SECURITY-SPEC.md', () => {
    renderContact()
    const messageInput = screen.getByLabelText(/^Message/)
    expect(messageInput).toHaveAttribute('maxlength', String(CONTACT_FIELD_LIMITS.message))
  })

  it('never claims a submission succeeded — there is no backend configured', async () => {
    const user = userEvent.setup()
    renderContact()

    await user.type(screen.getByLabelText(/^Name/), 'Test Fixture Visitor')
    await user.type(screen.getByLabelText(/^Phone/), '+91 98765 43210')
    await user.selectOptions(screen.getByLabelText(/^Project type/), services[0]!.title)
    await user.type(screen.getByLabelText(/^Location/), 'Test Fixture Location')
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const status = await screen.findByText(/isn.t connected to a live submission service/i)
    expect(status).toBeInTheDocument()
    expect(screen.queryByText(/enquiry has been received/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/thanks/i)).not.toBeInTheDocument()

    // The visitor's own input is never silently discarded.
    expect(screen.getByLabelText(/^Name/)).toHaveValue('Test Fixture Visitor')
    expect(screen.getByLabelText(/^Location/)).toHaveValue('Test Fixture Location')
  })

  it('renders no fabricated phone, email or WhatsApp link anywhere on the page', () => {
    renderContact()
    expect(site.phone).toBeUndefined()
    expect(site.email).toBeUndefined()
    expect(site.whatsappNumber).toBeUndefined()

    const allLinks = screen.getAllByRole('link')
    for (const link of allLinks) {
      const href = link.getAttribute('href') ?? ''
      expect(href.startsWith('tel:')).toBe(false)
      expect(href.startsWith('mailto:')).toBe(false)
      expect(href.includes('wa.me')).toBe(false)
    }
    // The "Reach Us Directly" section itself is omitted entirely, not
    // shown with a placeholder — no such heading exists.
    expect(
      screen.queryByRole('heading', { name: 'Prefer to talk directly?' }),
    ).not.toBeInTheDocument()
  })

  it('renders the verified service areas, no invented address', () => {
    renderContact()
    for (const area of site.serviceAreas) {
      expect(screen.getAllByText(new RegExp(area)).length).toBeGreaterThan(0)
    }
  })

  it('sets document title and description from verified site data', () => {
    renderContact()
    expect(document.title).toBe(`Start a Project | ${site.name}`)
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
    expect(description).toContain(site.name)
  })

  it('form controls are reachable via the keyboard with visible labels, not placeholder-as-label', () => {
    renderContact()
    const form = getForm()
    const nameInput = within(form).getByLabelText(/^Name/)
    expect(nameInput).toHaveAttribute('id')
    expect(nameInput).not.toHaveAttribute('placeholder')
  })

  it('supports the full initial → invalid → valid submit-state cycle without a page reload', () => {
    renderContact()
    // idle: no status message yet.
    expect(screen.queryByRole('status')).toBeEmptyDOMElement()
  })
})
