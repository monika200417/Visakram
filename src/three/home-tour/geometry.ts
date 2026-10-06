import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Box, Mat, ZoneId } from './villa/layout'

/**
 * A box at centre `c` with size `s`, positioned in world space, whose UVs are
 * scaled by each face's real size so a texture tiles at `uv` metres no matter
 * how the part is proportioned (long walls, thin slabs and so on). Merging
 * these per material keeps the whole house to a few dozen draw calls.
 */
export function boxGeometry(
  c: readonly [number, number, number],
  s: readonly [number, number, number],
  uv = 2,
): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(s[0], s[1], s[2])
  const uvs = geometry.getAttribute('uv') as THREE.BufferAttribute
  // BoxGeometry face order: +x, −x, +y, −y, +z, −z (4 vertices each)
  const faceSize: ReadonlyArray<readonly [number, number]> = [
    [s[2], s[1]],
    [s[2], s[1]],
    [s[0], s[2]],
    [s[0], s[2]],
    [s[0], s[1]],
    [s[0], s[1]],
  ]
  for (let face = 0; face < 6; face++) {
    const [w, h] = faceSize[face]!
    for (let v = 0; v < 4; v++) {
      const i = face * 4 + v
      uvs.setXY(i, (uvs.getX(i) * w) / uv, (uvs.getY(i) * h) / uv)
    }
  }
  geometry.translate(c[0], c[1], c[2])
  return geometry
}

export type ZoneGeometries = Partial<Record<Mat, THREE.BufferGeometry>>

/** Merges every box of a zone into one geometry per material. */
export function mergeZone(parts: readonly Box[], zone: ZoneId): ZoneGeometries {
  const byMaterial = new Map<Mat, THREE.BufferGeometry[]>()
  for (const part of parts) {
    if (part.zone !== zone) continue
    const centre = [0, 1, 2].map((a) => (part.min[a]! + part.max[a]!) / 2) as [
      number,
      number,
      number,
    ]
    const size = [0, 1, 2].map((a) => part.max[a]! - part.min[a]!) as [number, number, number]
    const list = byMaterial.get(part.mat) ?? []
    list.push(boxGeometry(centre, size, part.uv))
    byMaterial.set(part.mat, list)
  }
  const result: ZoneGeometries = {}
  for (const [mat, list] of byMaterial) {
    const merged = mergeGeometries(list, false)
    list.forEach((g) => g.dispose())
    if (merged) result[mat] = merged
  }
  return result
}
