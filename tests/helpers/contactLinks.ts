import { screen } from '@testing-library/react'
import { expect } from 'vitest'
import { site } from '../../src/data/site'
import { telHref } from '../../src/utils/telHref'

/** Every tel: / mailto: link on the page is one of the client-supplied numbers or the supplied email, and every WhatsApp link goes to the WhatsApp number (the first phone number). */
export function expectOnlyVerifiedContactLinks() {
  const verified = new Set([
    ...site.phones.map(telHref),
    ...(site.email ? [`mailto:${site.email}`] : []),
  ])
  for (const link of screen.getAllByRole('link')) {
    const href = link.getAttribute('href') ?? ''
    if (href.startsWith('tel:') || href.startsWith('mailto:')) {
      expect(verified.has(href)).toBe(true)
    }
    if (href.includes('wa.me')) {
      const digits = (site.whatsappNumber ?? '').replace(/\D/g, '')
      expect(href.startsWith(`https://wa.me/${digits}`)).toBe(true)
    }
  }
}
