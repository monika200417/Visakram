import * as THREE from 'three'
import { SITE, terrainY } from './plan'

/**
 * The simplest honest surroundings for the villa: a ground mesh that follows
 * the plan's terrain (lawn, planted slope, sand), a flat sea, and a plain
 * gradient sky. Detailed landscape, ocean and sky belong to a later phase;
 * these exist so the architecture can be judged in its real setting.
 */

/** The stone platform and the lower terrace stand here, so the ground is cut away beneath them. */
const CUT = { x: [-2, 20], z: [-12, 0] } as const

function breaks(from: number, to: number, step: number): number[] {
  const out: number[] = []
  for (let v = from; v < to - 1e-9; v += step) out.push(v)
  return out
}

const LAWN = new THREE.Color(0x869560)
const SLOPE = new THREE.Color(0x6f7f4f)
const SAND = new THREE.Color(0xd9c9a0)
const WET = new THREE.Color(0xb9a982)

function groundColor(z: number, target: THREE.Color) {
  if (z >= -14) return target.copy(LAWN)
  if (z >= SITE.beachZ - 1) return target.copy(LAWN).lerp(SLOPE, Math.min(1, (-14 - z) / 8))
  if (z >= SITE.beachZ + 0.0) return target.copy(SLOPE)
  const t = Math.min(1, (SITE.beachZ - z) / 3)
  const sand = target.copy(SLOPE).lerp(SAND, t)
  return z <= SITE.waterlineZ + 4
    ? sand.lerp(WET, Math.min(1, (SITE.waterlineZ + 4 - z) / 4))
    : sand
}

/** A coarse-to-fine grid of the terrain, with analytic normals (the height depends on z only). */
export function createTerrainGeometry(): THREE.BufferGeometry {
  const xs = [...breaks(-400, -70, 10), ...breaks(-70, 90, 2), ...breaks(90, 400, 10), 400]
  const zs = [...breaks(SITE.waterlineZ, 45, 2), ...breaks(45, 300, 15), 300]
  const positions: number[] = []
  const normals: number[] = []
  const colors: number[] = []
  const color = new THREE.Color()

  const push = (x: number, z: number) => {
    const y = terrainY(z)
    const dy = (terrainY(z + 0.5) - terrainY(z - 0.5)) / 1.0
    const len = Math.hypot(dy, 1)
    positions.push(x, y, z)
    normals.push(0, 1 / len, -dy / len)
    groundColor(z, color)
    colors.push(color.r, color.g, color.b)
  }

  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < zs.length - 1; j++) {
      const [x0, x1] = [xs[i]!, xs[i + 1]!]
      const [z0, z1] = [zs[j]!, zs[j + 1]!]
      const inCut = x0 >= CUT.x[0] && x1 <= CUT.x[1] && z0 >= CUT.z[0] && z1 <= CUT.z[1]
      if (inCut) continue
      // Counter-clockwise seen from above (+Y)
      push(x0, z0)
      push(x0, z1)
      push(x1, z1)
      push(x0, z0)
      push(x1, z1)
      push(x1, z0)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return geometry
}

/** One big flat quad for the sea, from the waterline out to the horizon. */
export function createSeaGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.PlaneGeometry(4800, 2400).rotateX(-Math.PI / 2)
  geometry.translate(0, SITE.seaY - 0.02, SITE.waterlineZ - 1200)
  return geometry
}

export const HORIZON_COLOR = 0xe4e3da

/** A plain sky: pale warm at the horizon rising to a clear blue overhead. */
export function createSkyGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(900, 24, 14)
  const position = geometry.getAttribute('position')
  const colors: number[] = []
  const horizon = new THREE.Color(HORIZON_COLOR)
  const mid = new THREE.Color(0xb7d0e6)
  const zenith = new THREE.Color(0x6f9dd0)
  const c = new THREE.Color()
  for (let i = 0; i < position.count; i++) {
    const h = Math.max(0, position.getY(i) / 900)
    if (h < 0.35) c.copy(horizon).lerp(mid, h / 0.35)
    else c.copy(mid).lerp(zenith, Math.min(1, (h - 0.35) / 0.65))
    colors.push(c.r, c.g, c.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return geometry
}
