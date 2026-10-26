/** A `tel:` link for a phone number written for people ("+91 95154 52875"): digits and a leading + only. */
export function telHref(number: string): string {
  const digits = number.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}
