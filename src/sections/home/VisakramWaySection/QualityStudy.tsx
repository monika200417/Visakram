import { wayResolveAt, wayStageStarts } from '../../../data/visakramWay'
import { depth, from, grow, makeIso, range, reveal } from './wayLinework'
import { IsoBox, IsoFace, WaySvg } from './WayIso'
import s from './wayLinework.module.css'

const [MATERIAL, PRECISION, CRAFT, FINISH] = wayStageStarts.quality

// A facade detail in cutaway: one slab carrying a reinforced column, a layered
// wall build-up (cut face toward the viewer) and a thick marble panel.
const iso = makeIso(770, 392, 135)
const { p, poly, line } = iso

const SLAB_X = 2.6
const SLAB_Y = 3.8
const FLOOR = 0.4
const WX0 = 0.2
const WX1 = 1.3 // x of the wall's cut face

// The wall build-up, stacked along y so its layers read as stripes on the cut face.
const layers = [
  { name: 'brass', y0: 1.0, y1: 1.07, z1: 2.3, tone: 'gold' },
  { name: 'insulation', y0: 1.07, y1: 1.3, z1: 2.3, tone: 'foam', hatch: true },
  { name: 'concrete', y0: 1.3, y1: 1.78, z1: 2.3, tone: 'concrete', texture: 'concrete' },
  { name: 'gasket', y0: 1.78, y1: 1.84, z1: 2.3, tone: 'dark' },
  { name: 'brass2', y0: 1.84, y1: 1.9, z1: 2.3, tone: 'gold' },
  { name: 'cladding', y0: 1.9, y1: 2.22, z1: 2.45, tone: 'stone' },
] as const

const MARBLE = { y0: 2.28, y1: 2.66, z1: 2.8 }

const cageXs = [1.65, 1.9, 2.15]
const cageYs = [0.35, 0.6, 0.85]
const stirrupZs = [2.45, 2.65, 2.85, 3.05]

/**
 * Quality — the rendered plate: an isometric facade cutaway. Material
 * (polished black marble with gold veining, glazing, a concrete slab) →
 * structural precision (a reinforced concrete column, the copper rebar cage
 * exposed above it) → craftsmanship (the layered wall build-up: brass
 * profiles, insulation, concrete, gasket, cladding) → finish (rim light on
 * each precise edge). A conceptual illustration, not a Visakram project.
 */
export function QualityPlate() {
  return (
    <WaySvg>
      {/* MATERIAL — the ground, the slab, glazing and the marble panel */}
      <g {...reveal(0, 0.14)} {...depth(1)}>
        <polygon
          points={poly([
            [-1.4, -1.2, 0],
            [SLAB_X + 1.4, -1.2, 0],
            [SLAB_X + 1.4, SLAB_Y + 1.2, 0],
            [-1.4, SLAB_Y + 1.2, 0],
          ])}
          style={{ fill: 'url(#way-ground)' }}
        />
      </g>
      <g {...reveal(0.02, 0.16)}>
        <IsoBox
          iso={iso}
          box={[0, 0, 0, SLAB_X, SLAB_Y, FLOOR]}
          tone="concrete"
          texture="concrete"
        />
      </g>

      {/* STRUCTURAL PRECISION — the reinforced column and its exposed cage */}
      <g {...reveal(PRECISION, 0.14)} {...grow()}>
        <IsoBox
          iso={iso}
          box={[1.5, 0.2, FLOOR, 2.3, 1.0, 2.35]}
          tone="concrete"
          texture="concrete"
        />
      </g>
      <g {...reveal(PRECISION + 0.1, 0.16, true)}>
        {cageXs.flatMap((x) =>
          cageYs.map((y) =>
            x === cageXs[1] && y === cageYs[1] ? null : (
              <line
                key={`h${x}-${y}`}
                {...line([x, y, 1.9], [x, y, 3.15])}
                className={s.copperHalo}
              />
            ),
          ),
        )}
        {cageXs.flatMap((x) =>
          cageYs.map((y) =>
            x === cageXs[1] && y === cageYs[1] ? null : (
              <line key={`${x}-${y}`} {...line([x, y, 1.9], [x, y, 3.15])} className={s.copper} />
            ),
          ),
        )}
        {stirrupZs.map((z) => (
          <polygon
            key={z}
            points={poly([
              [cageXs[0] ?? 0, cageYs[0] ?? 0, z],
              [cageXs[2] ?? 0, cageYs[0] ?? 0, z],
              [cageXs[2] ?? 0, cageYs[2] ?? 0, z],
              [cageXs[0] ?? 0, cageYs[2] ?? 0, z],
            ])}
            className={s.copperThin}
          />
        ))}
      </g>

      {/* CRAFTSMANSHIP — the wall build-up, layer by layer, stripes on the cut face */}
      {layers.map((layer, i) => (
        <g key={layer.name} {...reveal(CRAFT + i * 0.035, 0.1)} {...from(-30)}>
          <IsoBox
            iso={iso}
            box={[WX0, layer.y0, FLOOR, WX1, layer.y1, layer.z1]}
            tone={layer.tone}
            texture={'texture' in layer ? layer.texture : undefined}
          />
          {'hatch' in layer ? (
            <IsoFace
              iso={iso}
              side="right"
              plane={WX1}
              from={layer.y0}
              to={layer.y1}
              z0={FLOOR}
              z1={layer.z1}
              style={{ fill: 'url(#way-hatch)' }}
            />
          ) : null}
        </g>
      ))}
      <g {...reveal(0.02, 0.18)}>
        <IsoBox
          iso={iso}
          box={[WX0, MARBLE.y0, FLOOR, WX1 + 0.05, MARBLE.y1, MARBLE.z1]}
          tone="dark"
          texture="marble"
        />
        <IsoFace
          iso={iso}
          side="right"
          plane={WX1 + 0.05}
          from={MARBLE.y0}
          to={MARBLE.y1}
          z0={FLOOR}
          z1={MARBLE.z1}
          style={{ fill: 'url(#way-tex-marble)' }}
        />
        <IsoFace
          iso={iso}
          side="right"
          plane={WX1 + 0.05}
          from={MARBLE.y0}
          to={MARBLE.y1}
          z0={FLOOR}
          z1={MARBLE.z1}
          style={{ fill: 'url(#way-reflect)' }}
        />
        <IsoFace
          iso={iso}
          side="left"
          plane={MARBLE.y1}
          from={WX0}
          to={WX1 + 0.05}
          z0={FLOOR}
          z1={MARBLE.z1}
          style={{ fill: 'url(#way-tex-marble)' }}
        />
        <IsoFace
          iso={iso}
          side="left"
          plane={MARBLE.y1}
          from={WX0}
          to={WX1 + 0.05}
          z0={FLOOR}
          z1={MARBLE.z1}
          style={{ fill: 'url(#way-reflect)' }}
        />
      </g>

      {/* A warm-lit interior beyond the glass, spilling light onto the slab */}
      <g {...reveal(0.06, 0.16)}>
        <IsoFace
          iso={iso}
          side="right"
          plane={0.9}
          from={2.82}
          to={3.74}
          z0={FLOOR}
          z1={2.6}
          style={{ fill: 'url(#way-interior)' }}
        />
        <IsoFace
          iso={iso}
          side="right"
          plane={0.92}
          from={2.9}
          to={3.66}
          z0={1.0}
          z1={2.4}
          style={{ fill: 'url(#way-lit)', opacity: 0.9 }}
        />
        <polygon
          points={poly([
            [0.9, 2.7, FLOOR],
            [2.1, 2.7, FLOOR],
            [2.1, 3.8, FLOOR],
            [0.9, 3.8, FLOOR],
          ])}
          style={{ fill: 'url(#way-warm)', opacity: 0.6 }}
        />
      </g>
      {/* Glazing along the front-left, framed in dark metal */}
      <g {...reveal(0.06, 0.16)}>
        {range(3, 0.3, 2.85).map((y) => (
          <IsoFace
            key={y}
            iso={iso}
            side="right"
            plane={1.0}
            from={y}
            to={y + 0.26}
            z0={FLOOR}
            z1={2.55}
            tone="glass"
          />
        ))}
        {range(4, 0.3, 2.82).map((y) => (
          <IsoBox key={`m${y}`} iso={iso} box={[0.95, y, FLOOR, 1.05, y + 0.04, 2.6]} tone="dark" />
        ))}
      </g>

      <g {...reveal(CRAFT + 0.2, 0.1)}>
        <IsoBox
          iso={iso}
          box={[WX1 - 0.12, 1.0, FLOOR, WX1 + 0.08, 2.3, FLOOR + 0.1]}
          tone="gold"
        />
      </g>

      {/* FINISH — rim light along each precise edge, then the warm resolve */}
      <g {...reveal(wayResolveAt, 0.1, true)}>
        <line
          {...line([WX1 + 0.05, MARBLE.y0, FLOOR], [WX1 + 0.05, MARBLE.y0, MARBLE.z1])}
          className={s.goldThick}
        />
        <line
          {...line([WX1 + 0.05, MARBLE.y0, MARBLE.z1], [WX1 + 0.05, MARBLE.y1, MARBLE.z1])}
          className={s.gold}
        />
        <line
          {...line([WX1 + 0.05, MARBLE.y1, MARBLE.z1], [WX1 + 0.05, MARBLE.y1, FLOOR])}
          className={s.gold}
        />
        <line {...line([SLAB_X, 0, FLOOR], [SLAB_X, SLAB_Y, FLOOR])} className={s.goldThick} />
      </g>
      <g {...reveal(wayResolveAt, 0.1)}>
        <ellipse
          cx="770"
          cy="560"
          rx="470"
          ry="210"
          style={{ fill: 'url(#way-warm)', opacity: 0.55 }}
        />
      </g>
    </WaySvg>
  )
}

const callouts = [
  { n: '01', name: 'Material', at: [WX1 + 0.05, 2.47, 1.9], x: 370, y: 130, w: 150 },
  { n: '02', name: 'Structural precision', at: [1.9, 0.6, 3.05], x: 840, y: 70, w: 215 },
  { n: '03', name: 'Craftsmanship', at: [WX1, 1.55, 1.5], x: 370, y: 215, w: 180 },
  { n: '04', name: 'Finish', at: [SLAB_X, 2.5, FLOOR], x: 930, y: 740, w: 130 },
] as const

/** Quality — the gold technical overlay: construction guides, dimensions, joint detail, callouts. */
export function QualityOverlay() {
  const ring = p(WX1, 2.25, 2.3)
  return (
    <WaySvg overlay>
      {/* A faint architectural wireframe, off to the lower left */}
      <g {...reveal(0, 0.2)} {...depth(2)} className={s.goldSoft}>
        <polyline points="60,700 200,640 330,700 190,770 60,700" />
        <polyline points="60,560 200,500 330,560 190,630 60,560" />
        <line x1="60" y1="700" x2="60" y2="560" />
        <line x1="200" y1="640" x2="200" y2="500" />
        <line x1="330" y1="700" x2="330" y2="560" />
        <line x1="190" y1="770" x2="190" y2="630" />
        <line x1="200" y1="500" x2="330" y2="430" />
        <line x1="330" y1="560" x2="460" y2="490" />
        <line x1="330" y1="430" x2="460" y2="490" />
      </g>

      {/* Construction guides, rising with the material */}
      <g {...reveal(MATERIAL + 0.08, 0.12)} className={s.goldDash}>
        {[1.0, 1.9, 2.28, 2.66].map((y) => (
          <line key={y} {...line([WX1, y, FLOOR], [WX1, y, 3.35])} />
        ))}
        <line {...line([WX1, 0, 2.3], [WX1, SLAB_Y, 2.3])} />
      </g>

      {/* FINISH — alignment datum, joint detail, dimensions, callouts */}
      <g {...reveal(FINISH, 0.12, true)} className={s.gold}>
        <line {...line([WX1, 0.95, 2.3], [WX1, 2.28, 2.3])} />
      </g>
      <g {...reveal(FINISH + 0.06, 0.1)}>
        <circle cx={ring[0]} cy={ring[1]} r="44" className={s.gold} />
        <circle cx={ring[0]} cy={ring[1]} r="4.5" className={s.dot} />
      </g>
      <g {...reveal(FINISH + 0.08, 0.12, true)} className={s.goldSoft}>
        <line {...line([SLAB_X + 0.45, 0, 0], [SLAB_X + 0.45, SLAB_Y, 0])} />
        <line {...line([SLAB_X + 0.35, 0, 0], [SLAB_X + 0.55, 0, 0])} />
        <line {...line([SLAB_X + 0.35, SLAB_Y, 0], [SLAB_X + 0.55, SLAB_Y, 0])} />
        <line {...line([1.6, 3.0, FLOOR], [1.6, 3.0, MARBLE.z1])} />
        <line {...line([1.5, 3.0, FLOOR], [1.7, 3.0, FLOOR])} />
        <line {...line([1.5, 3.0, MARBLE.z1], [1.7, 3.0, MARBLE.z1])} />
      </g>
      <g {...reveal(FINISH + 0.12, 0.1)}>
        {callouts.map(({ n, name, at, x, y, w }) => {
          const [ax, ay] = p(at[0], at[1], at[2])
          return (
            <g key={n}>
              <line x1={ax} y1={ay} x2={x} y2={y} className={s.goldSoft} />
              <line x1={x} y1={y} x2={x + w} y2={y} className={s.gold} />
              <circle cx={ax} cy={ay} r="5" className={s.dot} />
              <circle cx={ax} cy={ay} r="11" className={s.goldSoft} />
              <text x={x} y={y - 10} className={s.tag}>
                {n}
                <tspan dx="12" className={s.label}>
                  {name}
                </tspan>
              </text>
            </g>
          )
        })}
      </g>
    </WaySvg>
  )
}
