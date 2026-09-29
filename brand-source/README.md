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
