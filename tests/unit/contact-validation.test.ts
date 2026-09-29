import { describe, expect, it } from 'vitest'
import { CONTACT_FIELD_LIMITS, validateContactForm } from '../../src/utils/contactValidation'
import type { ContactFormValues } from '../../src/utils/contactValidation'

const projectTypes = ['Villas', 'Apartments', 'Residential Construction']

function validValues(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    name: 'Test Fixture Visitor',
    phone: '+91 98765 43210',
    whatsapp: '',
    projectType: 'Villas',
    location: 'Test Fixture Location',
    requirement: '',
    message: '',
    ...overrides,
  }
}

describe('validateContactForm', () => {
  it('accepts a fully valid submission with only required fields filled', () => {
    expect(validateContactForm(validValues(), projectTypes)).toEqual({})
  })

  it('requires name, phone, project type and location', () => {
    const errors = validateContactForm(
      validValues({ name: '', phone: '', projectType: '', location: '' }),
      projectTypes,
    )
    expect(errors.name).toMatch(/required/i)
    expect(errors.phone).toMatch(/required/i)
    expect(errors.projectType).toMatch(/required/i)
    expect(errors.location).toMatch(/required/i)
  })

  it('leaves whatsapp, requirement and message optional', () => {
    const errors = validateContactForm(validValues(), projectTypes)
    expect(errors.whatsapp).toBeUndefined()
    expect(errors.requirement).toBeUndefined()
    expect(errors.message).toBeUndefined()
  })

  it('rejects a project type that does not match an available service', () => {
    const errors = validateContactForm(
      validValues({ projectType: 'Not A Real Service' }),
      projectTypes,
    )
    expect(errors.projectType).toMatch(/choose a project type/i)
  })

  it('rejects an implausible phone number (too few digits, or non-phone characters)', () => {
    expect(validateContactForm(validValues({ phone: '12345' }), projectTypes).phone).toBeDefined()
    expect(
      validateContactForm(validValues({ phone: 'call me maybe' }), projectTypes).phone,
    ).toBeDefined()
  })

  it('accepts a range of legitimate international phone formats', () => {
    for (const phone of ['+91 98765 43210', '(040) 2345-6789', '+1-415-555-0132', '919876543210']) {
      expect(validateContactForm(validValues({ phone }), projectTypes).phone).toBeUndefined()
    }
  })

  it('validates the optional WhatsApp field with the same phone rule, only when filled', () => {
    expect(
      validateContactForm(validValues({ whatsapp: '' }), projectTypes).whatsapp,
    ).toBeUndefined()
    expect(
      validateContactForm(validValues({ whatsapp: 'not a number' }), projectTypes).whatsapp,
    ).toBeDefined()
    expect(
      validateContactForm(validValues({ whatsapp: '+91 98765 43210' }), projectTypes).whatsapp,
    ).toBeUndefined()
  })

  it('enforces every SECURITY-SPEC.md length limit', () => {
    const tooLong = (n: number) => 'a'.repeat(n + 1)
    expect(
      validateContactForm(validValues({ name: tooLong(CONTACT_FIELD_LIMITS.name) }), projectTypes)
        .name,
    ).toMatch(/fewer/i)
    expect(
      validateContactForm(
        validValues({ location: tooLong(CONTACT_FIELD_LIMITS.location) }),
        projectTypes,
      ).location,
    ).toMatch(/fewer/i)
    expect(
      validateContactForm(
        validValues({ requirement: tooLong(CONTACT_FIELD_LIMITS.requirement) }),
        projectTypes,
      ).requirement,
    ).toMatch(/fewer/i)
    expect(
      validateContactForm(
        validValues({ message: tooLong(CONTACT_FIELD_LIMITS.message) }),
        projectTypes,
      ).message,
    ).toMatch(/fewer/i)
  })

  it('accepts values at exactly the limit (boundary, not off-by-one)', () => {
    const atLimit = (n: number) => 'a'.repeat(n)
    expect(
      validateContactForm(validValues({ name: atLimit(CONTACT_FIELD_LIMITS.name) }), projectTypes)
        .name,
    ).toBeUndefined()
  })
})
