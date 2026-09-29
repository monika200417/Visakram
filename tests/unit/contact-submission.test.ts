import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isContactSubmissionConfigured,
  submitContactEnquiry,
} from '../../src/utils/contactSubmission'
import type { ContactFormValues } from '../../src/utils/contactValidation'

const fixturePayload: ContactFormValues = {
  name: 'Test Fixture Visitor',
  phone: '+91 98765 43210',
  whatsapp: '',
  projectType: 'Villas',
  location: 'Test Fixture Location',
  requirement: '',
  message: '',
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('submitContactEnquiry', () => {
  it('reports not_configured when no form endpoint is set (the real, current state)', async () => {
    vi.stubEnv('VITE_PUBLIC_FORM_ENDPOINT', '')
    expect(isContactSubmissionConfigured()).toBe(false)
    const result = await submitContactEnquiry(fixturePayload)
    expect(result).toEqual({ status: 'not_configured' })
  })

  it('never makes a network request, even with an endpoint configured', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.stubEnv('VITE_PUBLIC_FORM_ENDPOINT', 'https://example.invalid/test-fixture-endpoint')

    const result = await submitContactEnquiry(fixturePayload)

    expect(fetchSpy).not.toHaveBeenCalled()
    // This milestone implements no backend integration — even a
    // configured-looking endpoint is not acted on until a real, tested
    // provider is wired into this function (see its doc comment).
    expect(result).toEqual({ status: 'not_configured' })
  })

  it('treats a blank/whitespace-only endpoint as not configured', () => {
    vi.stubEnv('VITE_PUBLIC_FORM_ENDPOINT', '   ')
    expect(isContactSubmissionConfigured()).toBe(false)
  })
})
