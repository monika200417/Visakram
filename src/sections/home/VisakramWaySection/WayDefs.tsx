import { faceDir, tones, type WayTone } from './wayTones'

/**
 * Shared SVG paint for The Visakram Way: face gradients per material tone
 * (lit from the upper right), brass/copper, and the generated texture
 * patterns. Rendered once (a zero-size, aria-hidden <svg>) and referenced by
 * id from every chapter's SVG, so there are no per-chapter duplicates and no
 * SVG filters anywhere.
 */

const TEX = '/assets/images/way/'

export function WayDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {(Object.keys(tones) as WayTone[]).flatMap((name) =>
          (['top', 'l', 'r'] as const).map((face) => {
            const tone = tones[name]
            const [a, b] = tone[face]
            return (
              <linearGradient key={`${name}-${face}`} id={`way-${name}-${face}`} {...faceDir[face]}>
                <stop offset="0" stopColor={a} stopOpacity={tone.opacity ?? 1} />
                <stop offset="1" stopColor={b} stopOpacity={tone.opacity ?? 1} />
              </linearGradient>
            )
          }),
        )}

        {/* Metals */}
        <linearGradient id="way-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c8170" />
          <stop offset="0.45" stopColor="#f4ecdc" />
          <stop offset="1" stopColor="#a89d86" />
        </linearGradient>
        <linearGradient id="way-copper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c4441f" />
          <stop offset="0.5" stopColor="#c4441f" />
          <stop offset="1" stopColor="#c4441f" />
        </linearGradient>

        {/* Light */}
        <linearGradient id="way-shade-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="way-shade-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="way-reflect" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4ecdc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f4ecdc" stopOpacity="0.38" />
          <stop offset="1" stopColor="#f4ecdc" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="way-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8dcc8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#e8dcc8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="way-interior" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4540" />
          <stop offset="1" stopColor="#181614" />
        </linearGradient>
        <linearGradient id="way-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ecdc" stopOpacity="0.95" />
          <stop offset="1" stopColor="#cdbfa6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="way-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24211e" />
          <stop offset="1" stopColor="#161412" />
        </linearGradient>

        {/* Generated material textures */}
        <pattern id="way-tex-marble" patternUnits="userSpaceOnUse" width="200" height="400">
          <image
            href={`${TEX}way-marble.webp`}
            width="200"
            height="400"
            preserveAspectRatio="none"
          />
        </pattern>
        <pattern id="way-tex-concrete" patternUnits="userSpaceOnUse" width="260" height="260">
          <image
            href={`${TEX}way-concrete.webp`}
            width="260"
            height="260"
            preserveAspectRatio="none"
          />
        </pattern>
        <pattern id="way-tex-timber" patternUnits="userSpaceOnUse" width="120" height="120">
          <image
            href={`${TEX}way-timber.webp`}
            width="120"
            height="120"
            preserveAspectRatio="none"
          />
        </pattern>
        <pattern id="way-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8 L8 0" stroke="rgb(244 236 220 / 22%)" strokeWidth="1" />
        </pattern>
      </defs>
    </svg>
  )
}
