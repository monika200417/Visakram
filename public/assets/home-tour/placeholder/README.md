# Home Tour — PLACEHOLDER media (development only)

These files are copies of the _reference_ material in `docs/reference/home-tour/`:

- `reference-walkthrough.mp4` — the supplied reference reel (portrait, 720×1280,
  sparse keyframes). It is a camera/pacing reference, **not** production footage.
- `exterior.webp`, `staircase.webp` — web-sized copies of `master-exterior.png`
  and `master-staircase.png`.

**Usage rights are NOT confirmed** (a real-looking property, a visible house number,
a third-party brand poster, AI-tool watermarks). They exist so the media architecture
can be built and tested. They must never ship in production:

- `vite.config.ts` removes this folder from `dist/` on every production build
  (set `HOME_TOUR_ALLOW_PLACEHOLDERS=1` to keep it for a local preview build).
- To go live, replace the entries in `src/media/home-tour/manifest.ts` with cleared
  media and delete this folder. No other code needs to change.
