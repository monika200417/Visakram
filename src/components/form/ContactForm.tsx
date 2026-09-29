import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FormField } from './FormField'
import { Button } from '../buttons/Button'
import { services } from '../../data/services'
import { site } from '../../data/site'
import {
  CONTACT_FIELD_LIMITS,
  validateContactForm,
  type ContactFieldName,
  type ContactFormErrors,
  type ContactFormValues,
} from '../../utils/contactValidation'
import { submitContactEnquiry } from '../../utils/contactSubmission'
import styles from './ContactForm.module.css'

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  phone: '',
  whatsapp: '',
  projectType: '',
  location: '',
  requirement: '',
  message: '',
}

/** DOM order of the fields below — used to focus the first invalid one. */
const FIELD_ORDER: ContactFieldName[] = [
  'name',
  'phone',
  'whatsapp',
  'projectType',
  'location',
  'requirement',
  'message',
]

type SubmitState = 'idle' | 'submitting' | 'success' | 'blocked' | 'error'

const hasAlternativeContact = Boolean(site.phone || site.whatsappNumber || site.email)

/**
 * The enquiry form itself (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md
 * Chapter 13). Wires src/utils/contactValidation.ts and
 * src/utils/contactSubmission.ts together behind a small state machine.
 *
 * There is no backend today (VITE_PUBLIC_FORM_ENDPOINT is unset), so
 * `submitContactEnquiry` always resolves `not_configured` and the form
 * always lands on the honest `blocked` state — it never claims an
 * enquiry was received unless a real service actually receives it. The
 * `success` and `error` branches are wired end-to-end against the
 * adapter's full result type so a real provider can be connected later
 * by changing only `contactSubmission.ts`.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState<string | undefined>(undefined)

  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const whatsappRef = useRef<HTMLInputElement>(null)
  const projectTypeRef = useRef<HTMLSelectElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)
  const requirementRef = useRef<HTMLTextAreaElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const availableProjectTypes = services.map((service) => service.title)

  function handleChange(field: ContactFieldName) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
      setErrors((current) => {
        if (!current[field]) return current
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateContactForm(values, availableProjectTypes)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
      if (firstInvalid) {
        const refsByField: Record<ContactFieldName, HTMLElement | null> = {
          name: nameRef.current,
          phone: phoneRef.current,
          whatsapp: whatsappRef.current,
          projectType: projectTypeRef.current,
          location: locationRef.current,
          requirement: requirementRef.current,
          message: messageRef.current,
        }
        refsByField[firstInvalid]?.focus()
      }
      return
    }

    setSubmitState('submitting')
    const result = await submitContactEnquiry(values)

    if (result.status === 'success') {
      setSubmitState('success')
      setSubmitMessage(undefined)
      setValues(EMPTY_VALUES)
      return
    }

    if (result.status === 'error') {
      setSubmitState('error')
      setSubmitMessage(result.message)
      return
    }

    setSubmitState('blocked')
    setSubmitMessage(undefined)
  }

  const isSubmitting = submitState === 'submitting'

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField id="contact-name" label="Name" required error={errors.name}>
        <input
          id="contact-name"
          name="name"
          type="text"
          className={styles.control}
          value={values.name}
          onChange={handleChange('name')}
          maxLength={CONTACT_FIELD_LIMITS.name}
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          ref={nameRef}
        />
      </FormField>

      <FormField id="contact-phone" label="Phone" required error={errors.phone}>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          className={styles.control}
          value={values.phone}
          onChange={handleChange('phone')}
          maxLength={CONTACT_FIELD_LIMITS.phone}
          autoComplete="tel"
          required
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          ref={phoneRef}
        />
      </FormField>

      <FormField
        id="contact-whatsapp"
        label="WhatsApp number"
        error={errors.whatsapp}
        hint="If different from your phone number above."
      >
        <input
          id="contact-whatsapp"
          name="whatsapp"
          type="tel"
          className={styles.control}
          value={values.whatsapp}
          onChange={handleChange('whatsapp')}
          maxLength={CONTACT_FIELD_LIMITS.whatsapp}
          autoComplete="tel"
          aria-invalid={errors.whatsapp ? true : undefined}
          aria-describedby={errors.whatsapp ? 'contact-whatsapp-error' : 'contact-whatsapp-hint'}
          ref={whatsappRef}
        />
      </FormField>

      <FormField id="contact-project-type" label="Project type" required error={errors.projectType}>
        <select
          id="contact-project-type"
          name="projectType"
          className={styles.control}
          value={values.projectType}
          onChange={handleChange('projectType')}
          required
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={errors.projectType ? 'contact-project-type-error' : undefined}
          ref={projectTypeRef}
        >
          <option value="">Select a project type</option>
          {availableProjectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="contact-location" label="Location" required error={errors.location}>
        <input
          id="contact-location"
          name="location"
          type="text"
          className={styles.control}
          value={values.location}
          onChange={handleChange('location')}
          maxLength={CONTACT_FIELD_LIMITS.location}
          required
          aria-invalid={errors.location ? true : undefined}
          aria-describedby={errors.location ? 'contact-location-error' : undefined}
          ref={locationRef}
        />
      </FormField>

      <FormField
        id="contact-requirement"
        label="Approximate requirement"
        error={errors.requirement}
        hint="Plot size, built-up area, number of units — whatever you already know."
      >
        <textarea
          id="contact-requirement"
          name="requirement"
          className={styles.control}
          value={values.requirement}
          onChange={handleChange('requirement')}
          maxLength={CONTACT_FIELD_LIMITS.requirement}
          rows={3}
          aria-invalid={errors.requirement ? true : undefined}
          aria-describedby={
            errors.requirement ? 'contact-requirement-error' : 'contact-requirement-hint'
          }
          ref={requirementRef}
        />
      </FormField>

      <FormField id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          className={styles.control}
          value={values.message}
          onChange={handleChange('message')}
          maxLength={CONTACT_FIELD_LIMITS.message}
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          ref={messageRef}
        />
      </FormField>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>

      <div role="status" aria-live="polite" className={styles.status}>
        {submitState === 'success' && (
          <p className={styles.success}>Thanks — your enquiry has been received.</p>
        )}
        {submitState === 'blocked' && (
          <p className={styles.notice} data-dev-placeholder>
            This form isn&rsquo;t connected to a live submission service yet, so this enquiry
            hasn&rsquo;t been sent.
            {hasAlternativeContact
              ? ' Please reach out directly using the contact details on this page.'
              : ''}{' '}
            Your details above are still here — nothing has been lost.
          </p>
        )}
        {submitState === 'error' && (
          <p className={styles.notice}>
            {submitMessage ?? 'Something went wrong sending this enquiry. Please try again.'}
            {hasAlternativeContact
              ? ' You can also reach out directly using the contact details on this page.'
              : ''}
          </p>
        )}
      </div>
    </form>
  )
}
