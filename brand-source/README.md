# Brand source files (client-supplied, unmodified)

These are exactly as received from the client. They are kept here — outside `public/` —
so they are never bundled into the production build (docs/CLAUDE.md §30: "preserve original
files outside production if needed").

- `visakram_logo_dark_.svg` — dark (black) logo mark. 1323x672, transparent background.
- `visakram_logo_svg.svg` — gold/metallic logo mark. 1323x672, transparent background, 1.5MB
  (a full-resolution PNG re-encoded as base64 inside an SVG wrapper).
- `visakram-logo.jpeg` — superseded temporary raster logo. No longer referenced anywhere.

The production files actually used by the app live in `public/assets/brand/` as
`visakram-logo-dark.svg` and `visakram-logo-light.svg`. The dark mark is used unchanged
(already a reasonable 61KB). The gold mark's embedded raster was too heavy to ship on every
page (1.5MB on the critical render path — see docs/PERFORMANCE-BUDGET.md), so its source
image was resized to 720px wide (well above its largest planned display size) and
re-compressed, dropping it to ~135KB with no vector tracing and no color/design changes.
If the client supplies a true vector (AI/EPS/PDF) version later, replace the production
files directly.

## Production logos are cropped above the slogan

The three production SVGs in `public/assets/brand/` (`visakram-logo-dark.svg`,
`visakram-logo-light.svg`, `visakram-builders-white.svg`) are the client's artwork with one change:
their `height` and `viewBox` were shortened so the small slogan line under "BUILDERS" ("Building the
Future You Imagine") is cropped away (dark/light: 1323 x 594, white: 1304 x 581). The picture inside
each file is untouched, and the files here are the unmodified originals. To bring the slogan back,
restore the original `height`/`viewBox` (672 / 650) and the matching sizes in
`src/components/layout/Header.*` and `src/components/brand/Logo.*`.

## Gold "V" mark (favicon)

`visakram-logo-mark-gold.webp` is the client-supplied gold "V" mark on white (1254x1254), unmodified. The
browser-tab icons in `public/` (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`) are made from it: the
white background was keyed out to transparent (apple-touch-icon keeps a white square, as iOS requires),
cropped square around the mark and scaled.
