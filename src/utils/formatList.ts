/** "Quality, Timeliness and Transparency" — an Oxford-style joined list. */
export function formatList(items: readonly string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]!
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
