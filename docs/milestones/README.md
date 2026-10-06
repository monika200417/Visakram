# Milestones

## home-tour-dusk-v1.zip

Snapshot (uncommitted working tree, taken before the coastal-villa rewrite) of the
first Home Tour: a conceptual two-storey residence at dusk, nine chapters, one
pinned ScrollTrigger, procedural R3F scene, SVG/CSS static fallback.

Contents (paths are repo-relative): `src/three/home-tour/`,
`src/sections/home/HomeTourSection/`, `src/data/homeTour.ts`,
`src/pages/HomePage.tsx`, `public/assets/images/home-tour/`, and the four
`tests/unit/home-tour-*` files.

Restore with `tar -xf docs/milestones/home-tour-dusk-v1.zip` from the repo root
(this overwrites the files above).

The coastal-villa Home Tour reuses this architecture (one scroll value, one
camera path, layout-as-data, zone culling, static fallback) with a new villa
plan, golden-hour lighting and an eight-chapter journey.
