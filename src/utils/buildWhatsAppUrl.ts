/**
 * Builds a safe wa.me deep link. wa.me requires digits only (no +, spaces
 * or punctuation) in the path — the display format in src/data/site.ts is
 * cosmetic, so it is stripped down here rather than duplicated.
 *
 * The optional prefilled text is a fixed, generic statement of intent —
 * never anything typed into the enquiry form — so nothing from the
 * visitor's form fields ever leaves the browser through this URL
 * (docs/SECURITY-SPEC.md §9 — no unnecessary personal data in URLs).
 */
export function buildWhatsAppUrl(whatsappNumber: string, prefilledText?: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, '')
  const base = `https://wa.me/${digitsOnly}`
  if (!prefilledText) return base
  return `${base}?text=${encodeURIComponent(prefilledText)}`
}
