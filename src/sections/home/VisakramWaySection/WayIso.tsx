import type { CSSProperties, ReactNode } from 'react'
import type { makeIso } from './wayLinework'
import { toneFill, type WayTone } from './wayTones'
import s from './wayLinework.module.css'

export type Iso = ReturnType<typeof makeIso>
type Box = readonly [number, number, number, number, number, number] // x0 y0 z0 x1 y1 z1

/**
 * An axis-aligned isometric box showing its three visible faces — top,
 * the y-facing (left) side and the x-facing (right) side — shaded per
 * material tone from the shared defs (key light from the upper right).
 * `faces` can drop a face (e.g. a wall viewed edge-on); `texture` overlays a
 * generated material on the lit faces.
 */
export function IsoBox({
  iso,
  box,
  tone,
  texture,
  faces = 'tlr',
}: {
  iso: Iso
  box: Box
  tone: WayTone
  texture?: 'concrete' | 'marble' | 'timber'
  faces?: string
}) {
  const [x0, y0, z0, x1, y1, z1] = box
  const top = iso.poly([
    [x0, y0, z1],
    [x1, y0, z1],
    [x1, y1, z1],
    [x0, y1, z1],
  ])
  const left = iso.poly([
    [x0, y1, z0],
    [x1, y1, z0],
    [x1, y1, z1],
    [x0, y1, z1],
  ])
  const right = iso.poly([
    [x1, y0, z0],
    [x1, y1, z0],
    [x1, y1, z1],
    [x1, y0, z1],
  ])
  const tex = texture ? `url(#way-tex-${texture})` : undefined
  return (
    <g className={s.edge}>
      {faces.includes('l') ? <polygon points={left} style={{ fill: toneFill(tone, 'l') }} /> : null}
      {faces.includes('r') ? (
        <polygon points={right} style={{ fill: toneFill(tone, 'r') }} />
      ) : null}
      {faces.includes('t') ? (
        <polygon points={top} style={{ fill: toneFill(tone, 'top') }} />
      ) : null}
      {tex ? (
        <g className={s.texture}>
          {faces.includes('l') ? <polygon points={left} style={{ fill: tex }} /> : null}
          {faces.includes('r') ? <polygon points={right} style={{ fill: tex }} /> : null}
          {faces.includes('t') ? <polygon points={top} style={{ fill: tex }} /> : null}
        </g>
      ) : null}
    </g>
  )
}

/** A flat quad on the left (y = const) or right (x = const) face plane, for glazing, panels and openings. */
export function IsoFace({
  iso,
  side,
  from,
  to,
  z0,
  z1,
  plane,
  tone,
  style,
  className,
}: {
  iso: Iso
  side: 'left' | 'right'
  from: number
  to: number
  z0: number
  z1: number
  /** Coordinate of the plane: y for the left face, x for the right face. */
  plane: number
  tone?: WayTone
  style?: CSSProperties
  className?: string
}) {
  const at = (i: number, z: number): [number, number, number] =>
    side === 'left' ? [i, plane, z] : [plane, i, z]
  const points = iso.poly([at(from, z0), at(to, z0), at(to, z1), at(from, z1)])
  return (
    <polygon
      points={points}
      className={className}
      style={{ ...(tone ? { fill: toneFill(tone, side === 'left' ? 'l' : 'r') } : {}), ...style }}
    />
  )
}

/** The shared 1200 × 800 film frame every plate and overlay is drawn in (cropped, never letterboxed). */
export function WaySvg({ children, overlay }: { children: ReactNode; overlay?: boolean }) {
  return (
    <svg
      className={`${s.root} ${overlay ? s.overlay : s.plate}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {children}
    </svg>
  )
}
