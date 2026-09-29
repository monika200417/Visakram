# Asset directory structure

Predictable locations and names for real media, so it can be dropped in
without touching the data layer or components (Milestone 5 §11–12).

```
public/assets/
├── brand/      Logo variants and other brand marks (already populated)
├── images/     General site photography not tied to a project or founder
├── videos/     Video files (hero, process, etc.)
├── founders/   Founder portraits
├── projects/   Project hero/gallery photography
└── icons/      Any custom icon assets (SVG preferred)
```

## Naming

Use predictable, purpose-communicating names — not camera filenames like
`IMG_9382-final2.jpg`.

```
brand/visakram-logo-dark.svg
brand/visakram-logo-light.svg

projects/<project-slug>-hero.webp
projects/<project-slug>-01.webp
projects/<project-slug>-02.webp

founders/founder-<founder-slug>.webp

videos/<project-slug>-walkthrough.mp4
```

`<project-slug>` and `<founder-slug>` are the `slug` fields in
`src/data/projects.ts` and `src/data/founders.ts` — matching them keeps an
asset traceable to the data entry that references it (`media.hero.src`,
`media.gallery[].src`, `founder.image`, etc.).

Reference an asset from `src/data/*.ts` with the path relative to
`public/`, e.g. `/assets/projects/example-slug-hero.webp` — never hardcode
an asset path inside a component.

The `.gitkeep` files in the empty directories above only keep the folder
structure in version control; delete one the moment its directory holds a
real file.
