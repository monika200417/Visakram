import type { ContactFormValues } from './contactValidation'

export type ContactSubmissionPayload = ContactFormValues

export type ContactSubmissionResult =
  { status: 'not_configured' } | { status: 'success' } | { status: 'error'; message: string }

/**
 * VITE_PUBLIC_FORM_ENDPOINT is a public, client-exposed build value (see
 * .env.example and docs/SECURITY-SPEC.md §4-5), never a secret. It is
 * currently unset in this project — no external form/email service has
 * been selected yet (docs/TECHNICAL-ARCHITECTURE.md §20: "the exact
 * provider must be selected and tested before production") — so this
 * always reports "not configured" today.
 */
function getConfiguredFormEndpoint(): string | undefined {
  const endpoint = import.meta.env.VITE_PUBLIC_FORM_ENDPOINT
  return typeof endpoint === 'string' && endpoint.trim().length > 0 ? endpoint : undefined
}

export function isContactSubmissionConfigured(): boolean {
  return getConfiguredFormEndpoint() !== undefined
}

/**
 * The submission adapter boundary
 * (form UI → submit handler → this function → future API/form
 * provider/CRM). This milestone does not implement a backend, so this
 * function never makes a network request and never reports `success` —
 * doing either against an endpoint nobody has actually selected and
 * tested would mean inventing a service and lying to the visitor about
 * what happened to their enquiry.
 *
 * When a real provider is chosen, wiring it means implementing the
 * request inside the `endpoint` branch below (using whatever request
 * shape that provider requires) and returning `success`/`error`
 * accordingly. Nothing in the calling form needs to change — it already
 * handles all three result states.
 */
export async function submitContactEnquiry(
  // Unused today: no request is made (see doc comment above), so nothing
  // reads the payload yet. Kept as a real, typed parameter — not
  // removed — so the future network-request branch can use it without
  // changing this function's signature or any caller.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: ContactSubmissionPayload,
): Promise<ContactSubmissionResult> {
  const endpoint = getConfiguredFormEndpoint()
  if (!endpoint) {
    return { status: 'not_configured' }
  }

  // Intentionally unreachable today (see doc comment above) — no request
  // is made from here until a real, tested provider is wired in.
  return { status: 'not_configured' }
}
