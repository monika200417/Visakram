import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '../../src/utils/buildWhatsAppUrl'

describe('buildWhatsAppUrl', () => {
  it('strips formatting characters down to digits only', () => {
    expect(buildWhatsAppUrl('+91 (900) 000-0001')).toBe('https://wa.me/919000000001')
  })

  it('appends an encoded prefilled message when given one', () => {
    const url = buildWhatsAppUrl('+919000000001', 'Hi there')
    expect(url).toBe('https://wa.me/919000000001?text=Hi%20there')
  })

  it('omits the query string entirely when no message is given', () => {
    const url = buildWhatsAppUrl('+919000000001')
    expect(url).not.toContain('?')
  })
})
