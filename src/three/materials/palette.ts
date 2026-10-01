/**
 * Numeric (hex) mirrors of the relevant design tokens in
 * src/styles/tokens.css, for Three.js material colors — the renderer
 * cannot read CSS custom properties directly. Keep in sync with
 * tokens.css by hand, same approach as src/animations/motion-tokens.ts.
 */
export const threePalette = {
  ink: 0x11120f,
  charcoal: 0x24251f,
  paper: 0xf4f1ea,
  stone: 0xd8d1c5,
  terracotta: 0xa65d45,
  terracottaDark: 0x7f4433,
} as const
