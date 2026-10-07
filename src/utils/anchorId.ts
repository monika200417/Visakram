/** "Quality" -> "quality": a stable in-page anchor id derived from a title. */
export function toAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
