/**
 * Small, dependency-free development-time checks for the data layer
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md content-truth rules;
 * Milestone 5 §13). These guard against the kind of mistake that's easy to
 * make by hand — a copy-pasted slug, a missing identifier — not full
 * runtime schema validation. No new dependency: TypeScript already
 * prevents malformed shapes.
 */

/** Throws if any item is missing its identifier, or two items share one. */
export function assertUniqueIdentifiers<T extends Record<string, unknown>>(
  items: readonly T[],
  key: keyof T,
  label: string,
): void {
  const seen = new Set<unknown>()
  for (const item of items) {
    const value = item[key]
    if (value === undefined || value === null || value === '') {
      throw new Error(`${label}: found an item with a missing "${String(key)}"`)
    }
    if (seen.has(value)) {
      throw new Error(`${label}: duplicate "${String(key)}" value "${String(value)}"`)
    }
    seen.add(value)
  }
}
