# Home Tour — REFERENCE stills (development only)

These are web-sized copies of the reference images in `docs/reference/home-tour/`:

| File                | Source                 |
| ------------------- | ---------------------- |
| `exterior.webp`     | `master-exterior.png`  |
| `entry.webp`        | `master-entry.png`     |
| `staircase.webp`    | `master-staircase.png` |
| `bedroom.webp`      | `master-bedroom.png`   |
| `balcony.webp`      | `master-balcony.png`   |
| `living.webp`       | `living-room.png`      |
| `dining.webp`       | `dining-room.png`      |
| `kitchen.webp`      | `kitchen.jpeg`         |
| `final-reveal.webp` | `final-reveal.png`     |

They are **reference art, not production media**, and their usage rights are NOT
confirmed: they carry an AI-tool watermark, and some show a real-looking house number
or a third-party brand poster. They let the tour be developed and reviewed.
They must never ship in production:

- `src/media/home-tour/manifest.ts` only uses them when `import.meta.env.DEV` is true
  (or `VITE_HOME_TOUR_ALLOW_PLACEHOLDERS=1` is set for a local preview build).
- `vite.config.ts` deletes this folder from `dist/` on every production build unless
  `VITE_HOME_TOUR_ALLOW_PLACEHOLDERS=1` is set.

To go live, fill in `poster` and `video` for each chapter in the manifest with cleared
media, then delete this folder. No other code needs to change. `final-reveal.png` is INTENTIONALLY a byte-identical copy of `master-exterior.png`: the tour closes
on the same exterior composition it opened with, as its own chapter. The living, dining and kitchen references come from different houses than the exterior and
stair; they show where each chapter is headed, not the villa itself.

There is no video here: the supplied portrait reel was only a camera/pacing reference and
is not used by the site.
