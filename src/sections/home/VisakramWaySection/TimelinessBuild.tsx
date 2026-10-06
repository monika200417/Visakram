import { wayResolveAt, wayStageStarts } from '../../../data/visakramWay'
import { from, grow, makeIso, range, reveal } from './wayLinework'
import { IsoBox, IsoFace, WaySvg } from './WayIso'
import s from './wayLinework.module.css'

const [FOUNDATION, STRUCTURE, FLOORS, ENVELOPE, COMPLETION] = wayStageStarts.timeliness

// One building, drawn once: 3 × 2 bays, 4 storeys, shared by plate and overlay.
const W = 3
const D = 2
const LEVELS = 4
const FZ = 0.95
const H = LEVELS * FZ
const iso = makeIso(690, 400, 88)
const { p, poly, line } = iso

const FACE_L = D + 0.15 // plane of the left (y-facing) envelope
const FACE_R = W + 0.15 // plane of the right (x-facing) envelope

const storeys = range(LEVELS, 1)
const columns = range(W + 1, 1)
  .flatMap((i) => range(D + 1, 1).map((j) => ({ i, j })))
  .sort((a, b) => a.i + a.j - (b.i + b.j))

/** Back-to-front painter order: each storey's columns before the slab above it. */
function Frame() {
  return (
    <>
      {storeys.map((k) => (
        <g key={k}>
          <g {...reveal(STRUCTURE + k * 0.045, 0.08)} {...grow()}>
            {columns.map(({ i, j }) => (
              <IsoBox
                key={`${i}-${j}`}
                iso={iso}
                box={[i - 0.07, j - 0.07, k * FZ, i + 0.07, j + 0.07, (k + 1) * FZ]}
                tone="concrete"
              />
            ))}
          </g>
          <g {...reveal(FLOORS + k * 0.045, 0.09)} {...from(-46)}>
            <IsoBox
              iso={iso}
              box={[-0.15, -0.15, (k + 1) * FZ - 0.12, W + 0.15, D + 0.15, (k + 1) * FZ]}
              tone="concrete"
              texture="concrete"
            />
          </g>
        </g>
      ))}
    </>
  )
}

/** Glazing, spandrels and mullions for one storey on both visible faces. */
function Envelope({ k }: { k: number }) {
  const z0 = k * FZ
  const z1 = (k + 1) * FZ
  return (
    <g>
      {range(W, 1).map((i) => (
        <g key={`l${i}`}>
          <IsoFace
            iso={iso}
            side="left"
            plane={FACE_L}
            from={i + 0.04}
            to={i + 0.96}
            z0={z0 + 0.1}
            z1={z1 - 0.06}
            tone="glass"
          />
          <IsoFace
            iso={iso}
            side="left"
            plane={FACE_L}
            from={i}
            to={i + 1}
            z0={z0}
            z1={z0 + 0.1}
            tone="stone"
          />
        </g>
      ))}
      {range(D, 1).map((i) => (
        <g key={`r${i}`}>
          <IsoFace
            iso={iso}
            side="right"
            plane={FACE_R}
            from={i + 0.04}
            to={i + 0.96}
            z0={z0 + 0.1}
            z1={z1 - 0.06}
            tone="glass"
          />
          <IsoFace
            iso={iso}
            side="right"
            plane={FACE_R}
            from={i}
            to={i + 1}
            z0={z0}
            z1={z0 + 0.1}
            tone="stone"
          />
        </g>
      ))}
    </g>
  )
}

function LitWindows({ k }: { k: number }) {
  const z0 = k * FZ + 0.2
  const z1 = (k + 1) * FZ - 0.16
  return (
    <g>
      {range(W, 1).map((i) => (
        <IsoFace
          key={`l${i}`}
          iso={iso}
          side="left"
          plane={FACE_L + 0.01}
          from={i + 0.14}
          to={i + 0.86}
          z0={z0}
          z1={z1}
          style={{ fill: 'url(#way-lit)' }}
        />
      ))}
      {range(D, 1).map((i) => (
        <IsoFace
          key={`r${i}`}
          iso={iso}
          side="right"
          plane={FACE_R + 0.01}
          from={i + 0.14}
          to={i + 0.86}
          z0={z0}
          z1={z1}
          style={{ fill: 'url(#way-lit)' }}
        />
      ))}
    </g>
  )
}

/**
 * Timeliness — the rendered plate: ONE building that constructs itself.
 * Foundation and rebar → columns rise → floor slabs drop in → glazing and
 * spandrels develop → cladding fins, parapet and lit windows → rim light.
 * Painter-ordered, shaded per face, no filters.
 */
export function TimelinessPlate() {
  return (
    <WaySvg>
      {/* Site: a dark ground plane */}
      <g {...reveal(0, 0.14)}>
        <polygon
          points={poly([
            [-2.6, -2.6, -0.3],
            [W + 2.6, -2.6, -0.3],
            [W + 2.6, D + 2.6, -0.3],
            [-2.6, D + 2.6, -0.3],
          ])}
          style={{ fill: 'url(#way-ground)' }}
        />
      </g>

      {/* 01 FOUNDATION */}
      <g {...reveal(FOUNDATION + 0.02, 0.14)} {...from(26)}>
        <IsoBox
          iso={iso}
          box={[-0.4, -0.4, -0.3, W + 0.4, D + 0.4, 0]}
          tone="concrete"
          texture="concrete"
        />
      </g>
      <g {...reveal(FOUNDATION + 0.1, 0.1, true)}>
        {columns.map(({ i, j }) => (
          <line key={`${i}-${j}`} {...line([i, j, 0], [i, j, 0.55])} className={s.copperThin} />
        ))}
      </g>

      {/* 02 STRUCTURE + 03 FLOORS, interleaved back to front */}
      <Frame />

      {/* 04 ENVELOPE */}
      {storeys.map((k) => (
        <g key={`e${k}`} {...reveal(ENVELOPE + k * 0.045, 0.09)}>
          <Envelope k={k} />
        </g>
      ))}

      {/* 05 COMPLETION — cladding, parapet, lit windows, rim light */}
      <g {...reveal(COMPLETION + 0.01, 0.1)}>
        {range(D + 1, 1).map((j) => (
          <IsoBox
            key={`fr${j}`}
            iso={iso}
            box={[FACE_R, j - 0.045, 0.1, FACE_R + 0.13, j + 0.045, H]}
            tone="stone"
          />
        ))}
        {range(W + 1, 1).map((i) => (
          <IsoBox
            key={`fl${i}`}
            iso={iso}
            box={[i - 0.045, FACE_L, 0.1, i + 0.045, FACE_L + 0.13, H]}
            tone="timber"
            texture="timber"
          />
        ))}
        <IsoBox iso={iso} box={[-0.15, FACE_L - 0.08, H, FACE_R, FACE_L, H + 0.16]} tone="stone" />
        <IsoBox iso={iso} box={[FACE_R - 0.08, -0.15, H, FACE_R, FACE_L, H + 0.16]} tone="stone" />
      </g>
      {storeys.map((k) => (
        <g key={`w${k}`} {...reveal(COMPLETION + 0.08 + k * 0.03, 0.08)}>
          <LitWindows k={k} />
        </g>
      ))}
      <g {...reveal(wayResolveAt, 0.1)}>
        <ellipse
          cx="730"
          cy="520"
          rx="420"
          ry="150"
          style={{ fill: 'url(#way-warm)', opacity: 0.6 }}
        />
      </g>
      <g {...reveal(wayResolveAt, 0.1, true)}>
        <polyline
          points={poly([
            [-0.15, FACE_L, H + 0.16],
            [FACE_R, FACE_L, H + 0.16],
            [FACE_R, -0.15, H + 0.16],
          ])}
          className={s.goldThick}
        />
        <polyline
          points={poly([
            [-0.4, D + 0.4, 0],
            [W + 0.4, D + 0.4, 0],
            [W + 0.4, -0.4, 0],
          ])}
          className={s.gold}
        />
      </g>
    </WaySvg>
  )
}

// The surveying datum: a straight gold alignment from the foundation corner to the roof corner.
const S0 = p(-0.6, D + 0.55, 0)
const S4 = p(W + 0.55, -0.45, H + 0.5)
const stations = wayStageStarts.timeliness.map((start, i) => {
  const t = i / (wayStageStarts.timeliness.length - 1)
  return { start, x: S0[0] + (S4[0] - S0[0]) * t, y: S0[1] + (S4[1] - S0[1]) * t }
})

/** Timeliness — the gold technical overlay: setting-out grid, surveying datum, dimensions, level marks. */
export function TimelinessOverlay() {
  return (
    <WaySvg overlay>
      {/* Site setting-out grid on the ground plane */}
      <g {...reveal(0, 0.14)} className={s.goldDash}>
        {range(9, 1, -2).map((x) => (
          <line key={`gx${x}`} {...line([x, -2.6, -0.3], [x, D + 2.6, -0.3])} />
        ))}
        {range(8, 1, -2).map((y) => (
          <line key={`gy${y}`} {...line([-2.6, y, -0.3], [W + 2.6, y, -0.3])} />
        ))}
      </g>

      {/* Dimensions along the foundation */}
      <g {...reveal(FOUNDATION + 0.12, 0.1, true)} className={s.goldSoft}>
        <line {...line([0, D + 0.95, 0], [W, D + 0.95, 0])} />
        <line {...line([0, D + 0.85, 0], [0, D + 1.05, 0])} />
        <line {...line([W, D + 0.85, 0], [W, D + 1.05, 0])} />
        <line {...line([W + 0.95, 0, 0], [W + 0.95, D, 0])} />
        <line {...line([W + 0.85, 0, 0], [W + 1.05, 0, 0])} />
        <line {...line([W + 0.85, D, 0], [W + 1.05, D, 0])} />
      </g>

      {/* Level datum: a vertical with a mark per storey as the slabs arrive */}
      <g {...reveal(STRUCTURE, 0.2, true)} className={s.goldSoft}>
        <line {...line([W + 0.95, D + 0.95, 0], [W + 0.95, D + 0.95, H])} />
      </g>
      {storeys.map((k) => (
        <g key={k} {...reveal(FLOORS + k * 0.045, 0.06)}>
          <line
            {...line([W + 0.85, D + 0.85, (k + 1) * FZ], [W + 1.05, D + 1.05, (k + 1) * FZ])}
            className={s.gold}
          />
        </g>
      ))}

      {/* The surveying datum, one segment and station per stage */}
      {stations.map((st, i) => {
        const prev = stations[i - 1]
        return (
          <g key={st.start}>
            {prev ? (
              <g {...reveal(st.start, 0.14, true)}>
                <line x1={prev.x} y1={prev.y} x2={st.x} y2={st.y} className={s.halo} />
                <line x1={prev.x} y1={prev.y} x2={st.x} y2={st.y} className={s.goldThick} />
              </g>
            ) : null}
            <g {...reveal(st.start, 0.1)}>
              <circle cx={st.x} cy={st.y} r="13" className={s.goldSoft} />
              <circle cx={st.x} cy={st.y} r="5.5" className={s.dot} />
              <line x1={st.x} y1={st.y - 14} x2={st.x} y2={st.y - 54} className={s.goldSoft} />
              <text x={st.x + 8} y={st.y - 40} className={s.tag}>
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          </g>
        )
      })}
    </WaySvg>
  )
}
