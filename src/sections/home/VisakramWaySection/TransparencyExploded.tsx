import type { ReactNode } from 'react'
import { wayResolveAt, wayStageStarts } from '../../../data/visakramWay'
import { exit, from, makeIso, range, reveal, shift } from './wayLinework'
import { IsoBox, IsoFace, WaySvg } from './WayIso'
import s from './wayLinework.module.css'

const STARTS = wayStageStarts.transparency
const CONVERGE_AT = wayResolveAt

const W = 3
const D = 2
const U = 72
const GAP = 1.4 // exploded spacing between layer bases, in grid units
// How tall each layer is once the stack closes into one building.
const HEIGHTS = [0.1, 0.8, 0.8, 0.85, 0.85] as const
const assembledBase = (k: number) => HEIGHTS.slice(0, k).reduce((a, b) => a + b, 0)

const iso = makeIso(640, 560, U)
const { p, poly, line } = iso

const layerNames = ['Plan', 'Structure', 'Walls & envelope', 'Materials & facade', 'Finished space']
const baseZ = (k: number) => k * GAP
const delta = (k: number) => (baseZ(k) - assembledBase(k)) * U

/** Wraps a layer so plate and overlay share the same converge move. */
function Layer({ k, children }: { k: number; children: ReactNode }) {
  return <g {...(delta(k) > 0 ? shift(delta(k), CONVERGE_AT) : {})}>{children}</g>
}

const colPos = range(W + 1, 1)
  .flatMap((i) => range(D + 1, 1).map((j) => ({ i, j })))
  .sort((a, b) => a.i + a.j - (b.i + b.j))

const rise = (k: number, dur = 0.18) => ({ ...reveal(STARTS[k] ?? 0, dur), ...from(34) })

/** A closed rectangle on the plane z, in grid units. */
const rect = (x0: number, y0: number, x1: number, y1: number, z: number) =>
  poly([
    [x0, y0, z],
    [x1, y0, z],
    [x1, y1, z],
    [x0, y1, z],
  ])

/**
 * Transparency — the rendered plate: an exploded architectural stack.
 * Plan → structure → walls & envelope → materials & facade → finished
 * space, each a shaded solid on its own level. At the end the layers close
 * into one stacked building.
 */
export function TransparencyPlate() {
  const z0 = baseZ(0)
  const z1 = baseZ(1)
  const z2 = baseZ(2)
  const z3 = baseZ(3)
  const z4 = baseZ(4)
  const top0 = z0 + 0.1
  return (
    <WaySvg>
      {/* 01 PLAN — the drawing surface with the plan inked on it */}
      <Layer k={0}>
        <g {...rise(0)}>
          <IsoBox
            iso={iso}
            box={[-0.12, -0.12, z0, W + 0.12, D + 0.12, top0]}
            tone="dark"
            texture="marble"
          />
          <g className={s.line}>
            <polygon points={rect(0, 0, W, D, top0)} className={s.strong} />
            <line {...line([1.5, 0, top0], [1.5, 1.2, top0])} className={s.strong} />
            <line {...line([0, 1.2, top0], [1.5, 1.2, top0])} className={s.strong} />
            <line {...line([1.5, 1.2, top0], [W, 1.2, top0])} className={s.strong} />
            <line {...line([2.2, 1.2, top0], [2.2, D, top0])} />
            <polyline
              points={poly([
                [0.5, 1.2, top0],
                [0.5, 1.7, top0],
                [1.0, 1.7, top0],
              ])}
            />
            <polygon points={rect(0.2, 0.2, 1.2, 0.8, top0)} />
            <polygon points={rect(1.9, 0.2, 2.8, 0.9, top0)} />
            <polygon points={rect(1.7, 1.45, 2.1, 1.85, top0)} />
          </g>
        </g>
      </Layer>

      {/* 02 STRUCTURE — slab, columns, beams */}
      <Layer k={1}>
        <g {...rise(1)}>
          <IsoBox
            iso={iso}
            box={[-0.12, -0.12, z1, W + 0.12, D + 0.12, z1 + 0.1]}
            tone="concrete"
            texture="concrete"
          />
          {colPos.map(({ i, j }) => (
            <IsoBox
              key={`${i}-${j}`}
              iso={iso}
              box={[i - 0.07, j - 0.07, z1 + 0.1, i + 0.07, j + 0.07, z1 + 0.72]}
              tone="concrete"
            />
          ))}
          {range(D + 1, 1).map((j) => (
            <IsoBox
              key={`bx${j}`}
              iso={iso}
              box={[0, j - 0.05, z1 + 0.72, W, j + 0.05, z1 + 0.8]}
              tone="concrete"
            />
          ))}
          {range(W + 1, 1).map((i) => (
            <IsoBox
              key={`by${i}`}
              iso={iso}
              box={[i - 0.05, 0, z1 + 0.72, i + 0.05, D, z1 + 0.8]}
              tone="concrete"
            />
          ))}
        </g>
      </Layer>

      {/* 03 WALLS & ENVELOPE — enclosing walls with openings */}
      <Layer k={2}>
        <g {...rise(2)}>
          <IsoBox iso={iso} box={[-0.06, -0.06, z2, 0.06, D + 0.06, z2 + 0.8]} tone="stone" />
          <IsoBox iso={iso} box={[-0.06, -0.06, z2, W + 0.06, 0.06, z2 + 0.8]} tone="stone" />
          <IsoBox
            iso={iso}
            box={[-0.06, D - 0.06, z2, W + 0.06, D + 0.06, z2 + 0.8]}
            tone="stone"
          />
          <IsoBox
            iso={iso}
            box={[W - 0.06, -0.06, z2, W + 0.06, D + 0.06, z2 + 0.8]}
            tone="stone"
          />
          {[0.25, 1.1, 1.95].map((x) => (
            <IsoFace
              key={`wl${x}`}
              iso={iso}
              side="left"
              plane={D + 0.07}
              from={x}
              to={x + 0.7}
              z0={z2 + 0.18}
              z1={z2 + 0.62}
              tone="glass"
            />
          ))}
          {[0.35, 1.1].map((y) => (
            <IsoFace
              key={`wr${y}`}
              iso={iso}
              side="right"
              plane={W + 0.07}
              from={y}
              to={y + 0.6}
              z0={z2 + 0.18}
              z1={z2 + 0.62}
              tone="glass"
            />
          ))}
        </g>
      </Layer>

      {/* 04 MATERIALS & FACADE — cladding panels lifted clear of the walls */}
      <Layer k={3}>
        <g {...rise(3)}>
          <IsoBox iso={iso} box={[0, D + 0.3, z3, 0.96, D + 0.37, z3 + 0.85]} tone="stone" />
          <IsoBox
            iso={iso}
            box={[1, D + 0.3, z3, 1.96, D + 0.37, z3 + 0.85]}
            tone="timber"
            texture="timber"
          />
          <IsoBox iso={iso} box={[2, D + 0.3, z3, 2.96, D + 0.37, z3 + 0.85]} tone="glass" />
          <IsoBox iso={iso} box={[W + 0.3, 0, z3, W + 0.37, 0.96, z3 + 0.85]} tone="glass" />
          <IsoBox iso={iso} box={[W + 0.3, 1, z3, W + 0.37, 1.96, z3 + 0.85]} tone="stone" />
          <IsoBox
            iso={iso}
            box={[0, D + 0.3, z3 + 0.85, W - 0.04, D + 0.37, z3 + 0.88]}
            tone="gold"
          />
        </g>
      </Layer>

      {/* 05 FINISHED SPACE — the glazed volume, lit from within */}
      <Layer k={4}>
        <g {...rise(4, 0.14)}>
          <IsoBox iso={iso} box={[0, 0, z4, W, D, z4 + 0.85]} tone="dark" />
          {range(W, 1).map((i) => (
            <IsoFace
              key={`fl${i}`}
              iso={iso}
              side="left"
              plane={D + 0.005}
              from={i + 0.1}
              to={i + 0.9}
              z0={z4 + 0.14}
              z1={z4 + 0.7}
              style={{ fill: 'url(#way-lit)' }}
            />
          ))}
          {range(D, 1).map((j) => (
            <IsoFace
              key={`fr${j}`}
              iso={iso}
              side="right"
              plane={W + 0.005}
              from={j + 0.1}
              to={j + 0.9}
              z0={z4 + 0.14}
              z1={z4 + 0.7}
              style={{ fill: 'url(#way-lit)' }}
            />
          ))}
          <IsoBox
            iso={iso}
            box={[-0.12, -0.12, z4 + 0.85, W + 0.12, D + 0.12, z4 + 0.95]}
            tone="stone"
          />
        </g>
        <g {...reveal(wayResolveAt, 0.1, true)}>
          <polyline
            points={poly([
              [-0.12, D + 0.12, z4 + 0.95],
              [W + 0.12, D + 0.12, z4 + 0.95],
              [W + 0.12, -0.12, z4 + 0.95],
            ])}
            className={s.goldThick}
          />
        </g>
      </Layer>
    </WaySvg>
  )
}

const swatches = [
  { name: 'Stone', at: [0.5, D + 0.33, 0.45] as const, y: 150 },
  { name: 'Timber', at: [1.5, D + 0.33, 0.45] as const, y: 205 },
  { name: 'Glass', at: [2.5, D + 0.33, 0.45] as const, y: 260 },
]

const corners: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [W, 0],
  [W, D],
  [0, D],
]

/** Transparency — the gold technical overlay: alignment, dimensions, section cut, callouts, tags. */
export function TransparencyOverlay() {
  const planZ = baseZ(0) + 0.1
  const cutZ = baseZ(2) + 0.4
  const cutA = p(1.5, -0.6, cutZ)
  const cutB = p(1.5, D + 0.6, cutZ)
  return (
    <WaySvg overlay>
      {[0, 1, 2, 3, 4].map((k) => {
        const z = baseZ(k)
        const [tx, ty] = p(W, 0, z)
        return (
          <Layer key={k} k={k}>
            {/* gold alignment from the layer below, retracting as the stack closes */}
            {k > 0 ? (
              <g {...reveal(STARTS[k] ?? 0, 0.1)} {...exit(CONVERGE_AT)} className={s.goldDash}>
                {corners.map(([x, y]) => (
                  <line key={`${x}-${y}`} {...line([x, y, z - GAP + 0.12], [x, y, z])} />
                ))}
              </g>
            ) : null}

            {/* the tag: numeral, name, and a gold sight line to the layer */}
            <g {...reveal(STARTS[k] ?? 0, 0.12)} {...exit(CONVERGE_AT)}>
              <line x1={tx + 12} y1={ty} x2="872" y2={ty - 4} className={s.goldSoft} />
              <circle cx={tx + 12} cy={ty} r="4.5" className={s.dot} />
              <text x="880" y={ty - 6} className={s.tag}>
                {String(k + 1).padStart(2, '0')}
              </text>
              <text x="880" y={ty + 14} className={s.label}>
                {layerNames[k]}
              </text>
            </g>
          </Layer>
        )
      })}

      {/* Plan: dimensions and structural axes */}
      <Layer k={0}>
        <g {...reveal(STARTS[0] ?? 0, 0.2, true)} {...exit(CONVERGE_AT)} className={s.goldSoft}>
          <line {...line([0, D + 0.7, planZ], [W, D + 0.7, planZ])} />
          <line {...line([0, D + 0.6, planZ], [0, D + 0.8, planZ])} />
          <line {...line([W, D + 0.6, planZ], [W, D + 0.8, planZ])} />
          <line {...line([W + 0.7, 0, planZ], [W + 0.7, D, planZ])} />
          <line {...line([W + 0.6, 0, planZ], [W + 0.8, 0, planZ])} />
          <line {...line([W + 0.6, D, planZ], [W + 0.8, D, planZ])} />
        </g>
        <g {...reveal(STARTS[0] ?? 0, 0.2)} {...exit(CONVERGE_AT)} className={s.goldDash}>
          {range(W + 1, 1).map((i) => (
            <line key={`ax${i}`} {...line([i, -0.5, planZ], [i, D + 0.5, planZ])} />
          ))}
          {range(D + 1, 1).map((j) => (
            <line key={`ay${j}`} {...line([-0.5, j, planZ], [W + 0.5, j, planZ])} />
          ))}
        </g>
      </Layer>

      {/* Walls & envelope: an architectural section cut */}
      <Layer k={2}>
        <g {...reveal(STARTS[2] ?? 0, 0.16)} {...exit(CONVERGE_AT)}>
          <line {...line([1.5, -0.6, cutZ], [1.5, D + 0.6, cutZ])} className={s.goldDash} />
          <circle cx={cutA[0]} cy={cutA[1]} r="9" className={s.gold} />
          <circle cx={cutB[0]} cy={cutB[1]} r="9" className={s.gold} />
        </g>
      </Layer>

      {/* Materials & facade: material callouts */}
      <Layer k={3}>
        <g {...reveal((STARTS[3] ?? 0) + 0.08, 0.1)} {...exit(CONVERGE_AT)}>
          {swatches.map(({ name, at, y }) => {
            const [ax, ay] = p(at[0], at[1], baseZ(3) + at[2])
            return (
              <g key={name}>
                <line x1={ax} y1={ay} x2="560" y2={y} className={s.goldSoft} />
                <circle cx={ax} cy={ay} r="4" className={s.dot} />
                <line x1="270" y1={y} x2="560" y2={y} className={s.gold} />
                <text x="440" y={y - 8} className={s.label}>
                  {name}
                </text>
              </g>
            )
          })}
        </g>
      </Layer>
    </WaySvg>
  )
}
