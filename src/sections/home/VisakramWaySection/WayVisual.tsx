import type { ReactNode } from 'react'
import type { WayChapterVisual, WayMotif } from '../../../data/visakramWay'
import styles from './WayVisual.module.css'

/**
 * Conceptual, procedural visuals for The Visakram Way — one continuous
 * architectural linework language across three chapters. Every motif is
 * three `data-way-beat` groups that the scroll timeline reveals in order.
 * Illustrative only; not a depiction of any real Visakram project.
 */

const W = 800
const H = 600

function range(n: number, step: number, from = 0) {
  return Array.from({ length: n }, (_, i) => from + i * step)
}

/** Quality — material (masonry courses) → craftsmanship (true, level) → finished detail. */
function QualityMotif() {
  const rows = range(13, 44, 20)
  return (
    <>
      <g data-way-beat className={styles.line}>
        {rows.map((y, r) => (
          <g key={y}>
            <line x1="0" y1={y} x2={W} y2={y} />
            {range(9, 100, r % 2 === 0 ? 30 : 80).map((x) => (
              <line key={x} x1={x} y1={y} x2={x} y2={y + 44} />
            ))}
          </g>
        ))}
      </g>
      <g data-way-beat>
        <rect x="150" y="196" width="500" height="220" className={styles.frame} />
        <line x1="90" y1="306" x2="710" y2="306" className={styles.accent} />
        {range(13, 50, 100).map((x) => (
          <line key={x} x1={x} y1="298" x2={x} y2="314" className={styles.accent} />
        ))}
      </g>
      <g data-way-beat>
        <circle cx="520" cy="300" r="128" className={styles.loupe} />
        <line x1="428" y1="392" x2="610" y2="392" className={styles.strong} />
        <line x1="428" y1="392" x2="428" y2="208" className={styles.strong} />
        <line x1="444" y1="376" x2="594" y2="376" className={styles.line} />
        <line x1="444" y1="376" x2="444" y2="226" className={styles.line} />
        <line x1="460" y1="360" x2="578" y2="360" className={styles.faint} />
        <line x1="460" y1="360" x2="460" y2="244" className={styles.faint} />
        <line x1="428" y1="392" x2="300" y2="500" className={styles.accent} />
      </g>
    </>
  )
}

/** Timeliness — site → structure → visible progress. */
function TimelinessMotif() {
  const cols = range(4, 150, 170)
  const levels = range(4, 100, 150)
  return (
    <>
      <g data-way-beat>
        <line x1="60" y1="500" x2="740" y2="500" className={styles.strong} />
        <rect x="110" y="470" width="580" height="60" className={styles.faint} />
        {range(10, 68, 60).map((x) => (
          <line key={x} x1={x} y1="500" x2={x - 28} y2="540" className={styles.faint} />
        ))}
        <line x1="170" y1="500" x2="170" y2="120" className={styles.dashed} />
        <line x1="620" y1="500" x2="620" y2="120" className={styles.dashed} />
      </g>
      <g data-way-beat>
        {cols.map((x) => (
          <line key={x} x1={x} y1="500" x2={x} y2="150" className={styles.strong} />
        ))}
        {levels.map((y) => (
          <line key={y} x1="170" y1={y} x2="620" y2={y} className={styles.strong} />
        ))}
      </g>
      <g data-way-beat>
        <line x1="700" y1="500" x2="700" y2="150" className={styles.faint} />
        {levels.map((y) => (
          <line key={y} x1="686" y1={y} x2="714" y2={y} className={styles.line} />
        ))}
        <line x1="700" y1="500" x2="700" y2="250" className={styles.accentThick} />
        <line x1="320" y1="350" x2="470" y2="450" className={styles.accent} />
        <line x1="470" y1="350" x2="320" y2="450" className={styles.accent} />
      </g>
    </>
  )
}

const decisionMarks = [
  { x: 280, y: 230, label: '1' },
  { x: 520, y: 210, label: '2' },
  { x: 400, y: 400, label: '3' },
]

/** Transparency — plan → decisions → clarity. */
function TransparencyMotif() {
  return (
    <>
      <g data-way-beat>
        <rect x="160" y="130" width="480" height="340" className={styles.strong} />
        <line x1="400" y1="130" x2="400" y2="330" className={styles.strong} />
        <line x1="160" y1="330" x2="400" y2="330" className={styles.strong} />
        <line x1="520" y1="330" x2="640" y2="330" className={styles.strong} />
        <line x1="520" y1="330" x2="520" y2="470" className={styles.strong} />
        <path d="M280 330 a40 40 0 0 1 40 -40" className={styles.faint} />
      </g>
      <g data-way-beat>
        {decisionMarks.map(({ x, y, label }) => (
          <g key={label}>
            <circle cx={x} cy={y} r="16" className={styles.accent} />
            <line x1={x} y1={y + 16} x2={x} y2={y + 46} className={styles.accent} />
            <text x={x} y={y + 5} className={styles.mark} textAnchor="middle">
              {label}
            </text>
          </g>
        ))}
      </g>
      <g data-way-beat>
        <line x1="160" y1="86" x2="640" y2="86" className={styles.line} />
        <line x1="160" y1="76" x2="160" y2="96" className={styles.line} />
        <line x1="640" y1="76" x2="640" y2="96" className={styles.line} />
        <line x1="400" y1="80" x2="400" y2="92" className={styles.faint} />
        <line x1="704" y1="130" x2="704" y2="470" className={styles.line} />
        <line x1="694" y1="130" x2="714" y2="130" className={styles.line} />
        <line x1="694" y1="470" x2="714" y2="470" className={styles.line} />
        <line x1="694" y1="330" x2="714" y2="330" className={styles.faint} />
      </g>
    </>
  )
}

const motifs: Record<WayMotif, () => ReactNode> = {
  quality: QualityMotif,
  timeliness: TimelinessMotif,
  transparency: TransparencyMotif,
}

/**
 * One chapter's visual layer. `data-way-media` is what the scroll timeline
 * scales/drifts (the "crop movement"); it wraps either the conceptual SVG or
 * real client media supplied through `visual.asset`, so replacing the
 * procedural artwork later never touches the animation.
 */
export function WayVisual({ visual }: { visual: WayChapterVisual }) {
  const { asset, motif } = visual
  const Motif = motifs[motif]
  return (
    <div className={styles.layer} data-way-layer>
      <div className={styles.media} data-way-media>
        {asset?.kind === 'image' ? (
          <img className={styles.asset} src={asset.src} alt="" loading="lazy" decoding="async" />
        ) : asset?.kind === 'video' ? (
          <video className={styles.asset} src={asset.src} muted loop playsInline autoPlay />
        ) : (
          <svg
            className={styles.svg}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <Motif />
          </svg>
        )}
      </div>
      <ol className={styles.beats}>
        {visual.beats.map((beat, index) => (
          <li key={beat} className={styles.beat} data-way-beat-label data-active={index === 0}>
            {beat}
          </li>
        ))}
      </ol>
    </div>
  )
}
