/**
 * Client-side validation only — a UX convenience, never a security
 * boundary (docs/SECURITY-SPEC.md §6: "Never trust client-side validation
 * alone"). Whatever external form/email service is eventually connected
 * (docs/TECHNICAL-ARCHITECTURE.md §20) must perform its own authoritative
 * validation; this module cannot and does not guarantee that.
 *
 * Length limits are the exact starting values from
 * docs/SECURITY-SPEC.md §7.
 */

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  phone: 30,
  whatsapp: 30,
  projectType: 100,
  location: 150,
  requirement: 500,
  message: 3000,
} as const

export type ContactFieldName = keyof typeof CONTACT_FIELD_LIMITS

export type ContactFormValues = Record<ContactFieldName, string>

export type ContactFormErrors = Partial<Record<ContactFieldName, string>>

/**
 * Deliberately permissive: accepts digits, spaces and the common
 * separators (+, -, (, )) so a legitimate international number is never
 * rejected for its formatting, while still catching obvious non-phone
 * input. Not a strict E.164 validator by design
 * (docs/SECURITY-SPEC.md §6 — "do not over-restrict international
 * formats unnecessarily").
 */
const PHONE_CHARSET = /^[+()\-\s\d]+$/

function isPlausiblePhone(value: string): boolean {
  if (!PHONE_CHARSET.test(value)) return false
  const digitCount = (value.match(/\d/g) ?? []).length
  return digitCount >= 7 && digitCount <= 15
}

function validateRequiredText(value: string, limit: number, label: string): string | undefined {
  if (value.length === 0) return `${label} is required.`
  if (value.length > limit) return `${label} must be ${limit} characters or fewer.`
  return undefined
}

function validateOptionalText(value: string, limit: number, label: string): string | undefined {
  if (value.length === 0) return undefined
  if (value.length > limit) return `${label} must be ${limit} characters or fewer.`
  return undefined
}

function validatePhone(value: string, limit: number, label: string): string | undefined {
  if (value.length === 0) return `${label} is required.`
  if (value.length > limit) return `${label} must be ${limit} characters or fewer.`
  if (!isPlausiblePhone(value)) return `Enter a valid ${label.toLowerCase()} number.`
  return undefined
}

function validateOptionalPhone(value: string, limit: number, label: string): string | undefined {
  if (value.length === 0) return undefined
  if (value.length > limit) return `${label} must be ${limit} characters or fewer.`
  if (!isPlausiblePhone(value)) return `Enter a valid ${label.toLowerCase()} number.`
  return undefined
}

/**
 * `availableProjectTypes` is passed in rather than imported from
 * services.ts directly, so this module has no dependency on the data
 * layer and stays trivially testable — the caller (ContactForm) is the
 * one place that reads src/data/services.ts.
 */
export function validateContactForm(
  values: ContactFormValues,
  availableProjectTypes: readonly string[],
): ContactFormErrors {
  const errors: ContactFormErrors = {}

  const nameError = validateRequiredText(values.name, CONTACT_FIELD_LIMITS.name, 'Name')
  if (nameError) errors.name = nameError

  const phoneError = validatePhone(values.phone, CONTACT_FIELD_LIMITS.phone, 'Phone')
  if (phoneError) errors.phone = phoneError

  const whatsappError = validateOptionalPhone(
    values.whatsapp,
    CONTACT_FIELD_LIMITS.whatsapp,
    'WhatsApp',
  )
  if (whatsappError) errors.whatsapp = whatsappError

  if (values.projectType.length === 0) {
    errors.projectType = 'Project type is required.'
  } else if (!availableProjectTypes.includes(values.projectType)) {
    errors.projectType = 'Choose a project type from the list.'
  }

  const locationError = validateRequiredText(
    values.location,
    CONTACT_FIELD_LIMITS.location,
    'Location',
  )
  if (locationError) errors.location = locationError

  const requirementError = validateOptionalText(
    values.requirement,
    CONTACT_FIELD_LIMITS.requirement,
    'Approximate requirement',
  )
  if (requirementError) errors.requirement = requirementError

  const messageError = validateOptionalText(values.message, CONTACT_FIELD_LIMITS.message, 'Message')
  if (messageError) errors.message = messageError

  return errors
}
