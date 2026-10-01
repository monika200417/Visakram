let cachedResult: boolean | undefined

/**
 * Best-effort WebGL availability check (docs/QA-CHECKLIST.md §15 "WebGL
 * failure scenario"; docs/SECURITY-SPEC.md §32). Some browsers throw
 * rather than return null when a context can't be created, so this is
 * wrapped defensively. Cached — the result cannot change within a page
 * visit, and creating a throwaway canvas is wasted work to repeat.
 */
export function detectWebglSupport(): boolean {
  if (cachedResult !== undefined) return cachedResult
  if (typeof document === 'undefined') {
    cachedResult = false
    return cachedResult
  }

  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cachedResult = Boolean(context)
  } catch {
    cachedResult = false
  }

  return cachedResult
}
