import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  WORDMARK_ASPECT,
  WORDMARK_BOX,
  WORDMARK_LETTER_PATHS,
  WORDMARK_SKYLINE_FULL,
  WORDMARK_SKYLINE_SIMPLE,
  WORDMARK_VIEWBOX,
} from './wordmark.generated'
import styles from './VisakramWordmark.module.css'

/**
 * The VISAKRAM wordmark: solid Lac Red letters with a city skyline cut out of their lower edge.
 *
 * The buildings are not drawn. The skyline is the black part of an SVG mask over the letters, so
 * wherever a building stands the colour is removed and whatever is behind the wordmark (a photograph,
 * the flight clip, a flat colour) shows through.
 *
 * Falling in: each letter is its own group, and the mask is applied inside that group, so a letter
 * carries its piece of the skyline with it while it moves. `drop` is a switch: while it is false the
 * letters wait out of sight above the window, the moment it turns true they fall one after another,
 * each easing down and settling into place (CSS animation — no animation library, no per-frame
 * JavaScript). Leave `drop` undefined and the wordmark is simply drawn. The start height is measured
 * so each letter begins just above the top edge of the window, wherever the wordmark sits.
 *
 * The letter paths are generated from real font outlines (wordmark.generated.ts), so there is no
 * font dependency and the shapes are exact at any size. `detail="auto"` switches to a simpler
 * skyline (fewer, wider buildings, no antennas) when the rendered width is too small for the fine
 * gaps and spires.
 */

/** Rendered width, in CSS px, under which 'auto' uses the simple skyline. */
const SIMPLE_BELOW = 640

type Props = {
  detail?: 'auto' | 'full' | 'simple'
  /** false: letters wait out of sight above. true: they fall, one after another. undefined: just drawn. */
  drop?: boolean
  /** Seconds after `drop` turns true before the first letter starts to fall. */
  dropDelay?: number
  /** Seconds between one letter starting to fall and the next. */
  dropStep?: number
  /** Seconds each letter takes to fall. */
  dropDuration?: number
  /** Accessible name. '' hides the wordmark from assistive tech when the word is already in the page text. */
  title?: string
  className?: string
}

export function VisakramWordmark({
  detail = 'auto',
  drop,
  dropDelay = 0,
  dropStep = 0.28,
  dropDuration = 1.25,
  title = 'VISAKRAM',
  className,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(Infinity)
  const [rise, setRise] = useState(1800) // how far above its place a letter waits, in path units
  const uid = `vwm-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const el = svgRef.current
    if (!el || detail !== 'auto' || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [detail])

  const { x, y, width: w, height: h } = WORDMARK_BOX
  const falling = drop !== undefined

  /* Measure how far the top of the window is above the wordmark, in path units, so every letter
     starts just clear of it. Measured again when drop turns on, because on first mount the page may
     not have been laid out at its final size. */
  useLayoutEffect(() => {
    if (!falling) return
    const measure = () => {
      const el = svgRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const perUnit = r.width / w
      if (perUnit > 0) setRise(Math.max(h, r.bottom / perUnit) + 60)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [falling, drop, w, h])

  const simple = detail === 'simple' || (detail === 'auto' && width < SIMPLE_BELOW)
  const skyline = simple ? WORDMARK_SKYLINE_SIMPLE : WORDMARK_SKYLINE_FULL

  const svgStyle = {
    aspectRatio: WORDMARK_ASPECT,
    '--rise': rise,
    '--drop-dur': `${dropDuration}s`,
  } as CSSProperties

  return (
    <svg
      ref={svgRef}
      className={[styles.svg, className].filter(Boolean).join(' ')}
      viewBox={WORDMARK_VIEWBOX}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      style={svgStyle}
    >
      <defs>
        <mask id={`${uid}-cut`} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>
          <rect x={x} y={y} width={w} height={h} fill="#fff" />
          <path d={skyline} fill="#000" />
        </mask>
      </defs>
      {WORDMARK_LETTER_PATHS.map((d, i) => (
        <g
          key={i}
          className={[styles.letter, falling ? (drop ? styles.falling : styles.waiting) : undefined]
            .filter(Boolean)
            .join(' ')}
          style={{ animationDelay: `${dropDelay + i * dropStep}s` }}
        >
          <path d={d} fill="var(--color-lac)" mask={`url(#${uid}-cut)`} />
        </g>
      ))}
    </svg>
  )
}
