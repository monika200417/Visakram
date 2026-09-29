/**
 * Numeric mirrors of docs/ANIMATION-SYSTEM.md §4 motion tokens, for GSAP
 * timelines (which need seconds, not CSS custom properties). Keep in sync
 * with the --motion-* / --ease-* variables in src/styles/tokens.css.
 */
export const motion = {
  micro: 0.18,
  ui: 0.35,
  editorial: 0.7,
  cinematic: 1.2,
} as const

export const ease = {
  standard: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
  enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
  exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
} as const
