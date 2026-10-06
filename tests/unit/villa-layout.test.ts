import { describe, expect, it } from 'vitest'
import { parts, solids, type Box, type ZoneId } from '../../src/three/home-tour/villa/layout'
import {
  CEIL0,
  CORE_X0,
  ENTRY_STEPS,
  FL0,
  FL1,
  FRONT_DOOR,
  HOUSE,
  LIVING_SLIDER,
  POOL,
  STAIR,
  STAIR_LANDING_Y,
  STAIR_Z0,
  SUITE_DOOR,
  SUITE_SLIDER,
  rooms,
  stairSurfaceAt,
} from '../../src/three/home-tour/villa/plan'
import {
  createSeaGeometry,
  createSkyGeometry,
  createTerrainGeometry,
} from '../../src/three/home-tour/villa/surroundings'

type Range = readonly [number, number]
const inside = (b: Box, x: number, y: number, z: number) =>
  x > b.min[0] && x < b.max[0] && y > b.min[1] && y < b.max[1] && z > b.min[2] && z < b.max[2]
const steps = (r: Range, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => r[0] + ((r[1] - r[0]) * i) / n)

/** Every sample point of an opening's volume must be free of obstacles. */
function expectClear(label: string, x: Range, y: Range, z: Range) {
  const hits: string[] = []
  for (const px of steps(x, 8))
    for (const py of steps(y, 6))
      for (const pz of steps(z, 4))
        for (const s of solids) if (inside(s, px, py, pz)) hits.push(`${label}: ${s.id}`)
  expect([...new Set(hits)]).toEqual([])
}

describe('Villa layout — openings, rooms and details', () => {
  it('leaves every door, slider and passage actually open', () => {
    expectClear(
      'front door',
      [FRONT_DOOR.x[0] + 0.05, FRONT_DOOR.x[1] - 0.05],
      [FL0 + 0.05, FL0 + FRONT_DOOR.height - 0.05],
      [-0.25, 0.25],
    )
    expectClear(
      'living slider',
      [LIVING_SLIDER.x[0] + 0.05, LIVING_SLIDER.x[1] - 0.05],
      [FL0 + 0.05, CEIL0 - 0.05],
      [-0.2, 0.2],
    )
    expectClear(
      'suite slider',
      [SUITE_SLIDER.x[0] + 0.05, SUITE_SLIDER.x[1] - 0.05],
      [FL1 + 0.05, 7.0],
      [-0.2, 0.2],
    )
    expectClear(
      'suite door',
      [15.9, 16.3],
      [FL1 + 0.1, FL1 + SUITE_DOOR.height - 0.1],
      [SUITE_DOOR.z[0] + 0.05, SUITE_DOOR.z[1] - 0.05],
    )
    expectClear(
      'foyer to living',
      [CORE_X0 - 0.2, CORE_X0 + 0.2],
      [FL0 + 0.1, 3.2],
      [2.5, STAIR.backZ - STAIR.width - 0.3],
    )
    expectClear(
      'stair arrival',
      [CORE_X0 - 0.4, CORE_X0 + 0.4],
      [FL1 + 0.1, FL1 + 2.2],
      [STAIR.backZ - STAIR.width + 0.1, STAIR.backZ - 0.1],
    )
  })

  it('builds the stair as continuous treads whose tops match the walking surface', () => {
    const treads = parts.filter((p) => p.role === 'stair')
    // nine treads per flight plus the landing
    expect(treads).toHaveLength(2 * (STAIR.risers - 1) + 1)
    for (const t of treads) {
      const cx = (t.min[0] + t.max[0]) / 2
      const cz = (t.min[2] + t.max[2]) / 2
      expect(stairSurfaceAt(cx, cz)).toBeCloseTo(t.max[1], 6)
      expect(t.max[1] - t.min[1]).toBeGreaterThanOrEqual(STAIR.riser - 1e-9)
    }
    expect(Math.max(...treads.map((t) => t.max[1]))).toBeCloseTo(FL1 - STAIR.riser, 6)
    expect(treads.some((t) => Math.abs(t.max[1] - STAIR_LANDING_Y) < 1e-9)).toBe(true)
    // glass balustrades run the open side of both flights and the void edge
    expect(parts.filter((p) => p.id.startsWith('stair.1.rail'))).toHaveLength(STAIR.risers - 1)
    expect(parts.filter((p) => p.id.startsWith('stair.2.rail'))).toHaveLength(STAIR.risers - 1)
    expect(parts.some((p) => p.id === 'gallery.rail.void')).toBe(true)
    expect(STAIR_Z0).toBeGreaterThan(5)
  })

  it('reaches the porch by stone steps whose treads rise one riser at a time', () => {
    const stepBoxes = parts.filter((p) => p.id.startsWith('step.'))
    expect(stepBoxes).toHaveLength(ENTRY_STEPS.count)
    stepBoxes.forEach((b, i) => expect(b.max[1]).toBeCloseTo((i + 1) * ENTRY_STEPS.riser, 6))
    const porch = parts.find((p) => p.id === 'porch')!
    expect(porch.max[1]).toBeCloseTo(FL0, 6)
  })

  it('wraps the glass in black aluminium frames: mullions, transoms and head rails', () => {
    const glass = parts.filter((p) => p.role === 'glass')
    const frames = parts.filter((p) => p.role === 'frame')
    expect(glass.length).toBeGreaterThanOrEqual(6)
    expect(frames.length).toBeGreaterThan(40)
    expect(frames.every((f) => f.mat === 'metal' && !f.solid)).toBe(true)
    expect(parts.filter((p) => p.id.includes('.mullion.')).length).toBeGreaterThan(15)
    expect(parts.filter((p) => p.id.includes('.head.')).length).toBeGreaterThanOrEqual(2)
  })

  it('cladding: natural stone masses, timber soffits and slat walls, black fascias', () => {
    const mats = (zone: ZoneId) => new Set(parts.filter((p) => p.zone === zone).map((p) => p.mat))
    expect(mats('shell').has('stone')).toBe(true)
    expect(mats('shell').has('timber')).toBe(true)
    expect(mats('shell').has('metal')).toBe(true)
    const slats = parts.filter((p) => p.id.includes('.slats.'))
    expect(slats.length).toBeGreaterThan(100)
    expect(slats.every((s) => s.mat === 'timber' && !s.solid)).toBe(true)
    expect(parts.filter((p) => p.id.startsWith('soffit.')).length).toBeGreaterThanOrEqual(3)
    expect(parts.filter((p) => p.id.startsWith('fascia.')).length).toBe(3)
    // the wing is a stone mass
    expect(parts.find((p) => p.id === 'wing')!.mat).toBe('stone')
  })

  it('keeps large furniture inside its own room, apart from everything else', () => {
    const furniture = parts.filter((p) => p.role === 'furniture')
    expect(furniture.length).toBeGreaterThan(20)
    const roomOf: Partial<Record<ZoneId, Range>> = {
      living: rooms.living.x,
      dining: rooms.dining.x,
      kitchen: rooms.kitchen.x,
      suite: rooms.suite.x,
    }
    for (const f of furniture) {
      expect(f.min[0], f.id).toBeGreaterThanOrEqual(HOUSE.x[0] - 1e-9)
      const room = roomOf[f.zone]
      if (room) {
        expect(f.min[0], f.id).toBeGreaterThanOrEqual(room[0] - 1e-9)
        expect(f.max[0], f.id).toBeLessThanOrEqual(room[1] + 1e-9)
        expect(f.min[2], f.id).toBeGreaterThanOrEqual(HOUSE.z[0])
        expect(f.max[2], f.id).toBeLessThanOrEqual(HOUSE.z[1] + 1e-9)
      }
    }
    // no two pieces of furniture interpenetrate (they may touch)
    const overlaps: string[] = []
    furniture.forEach((a, i) => {
      for (const b of furniture.slice(i + 1)) {
        const ov = [0, 1, 2].every(
          (k) => a.min[k]! < b.max[k]! - 1e-6 && b.min[k]! < a.max[k]! - 1e-6,
        )
        if (ov) overlaps.push(`${a.id} × ${b.id}`)
      }
    })
    expect(overlaps).toEqual([])
  })

  it('builds the pool as a real basin: lined, below the deck, with an infinity edge toward the sea', () => {
    const find = (id: string) => parts.find((p) => p.id === id)!
    const water = find('pool.water')
    expect(water.max[1]).toBeCloseTo(POOL.waterY, 6)
    expect(water.max[1]).toBeLessThan(FL0)
    expect(find('pool.lining').max[1]).toBeLessThan(water.min[1] - 1.2)
    // the edge wall toward the ocean stops at the water level; the others reach the deck
    expect(find('pool.wall.edge').max[1]).toBeLessThanOrEqual(POOL.waterY)
    expect(find('pool.wall.house').max[1]).toBeGreaterThan(POOL.waterY)
    // the deck is cut away where the pool is
    const decks = parts.filter((p) => p.id.startsWith('deck.'))
    for (const d of decks) {
      const overlapsPool =
        d.min[0] < POOL.x[1] && d.max[0] > POOL.x[0] && d.min[2] < POOL.z[1] && d.max[2] > POOL.z[0]
      expect(overlapsPool, d.id).toBe(false)
    }
  })

  it('keeps every part inside a sensible world box and every zone used', () => {
    for (const p of parts) {
      expect(p.min[0]).toBeGreaterThan(-5)
      expect(p.max[0]).toBeLessThan(26)
      expect(p.min[1]).toBeGreaterThan(-3)
      expect(p.max[1]).toBeLessThan(8)
      expect(p.min[2]).toBeGreaterThan(-13)
      expect(p.max[2]).toBeLessThan(12)
    }
    const zones = new Set(parts.map((p) => p.zone))
    for (const z of [
      'site',
      'shell',
      'foyer',
      'stair',
      'living',
      'dining',
      'kitchen',
      'gallery',
      'suite',
      'terraceUp',
    ] as const)
      expect(zones.has(z), z).toBe(true)
  })
})

describe('Villa surroundings', () => {
  it('builds a ground that follows the terrain, leaves the platform area cut out, and has unit normals', () => {
    const g = createTerrainGeometry()
    const pos = g.getAttribute('position')
    const normal = g.getAttribute('normal')
    expect(pos.count).toBeGreaterThan(1000)
    for (let i = 0; i < pos.count; i += 97) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      // inside the cut (platform + lower terrace) there are no triangles; vertices only touch its border
      const strictlyInCut = x > -2 && x < 20 && z > -12 && z < 0
      expect(strictlyInCut).toBe(false)
      expect(Math.hypot(normal.getX(i), normal.getY(i), normal.getZ(i))).toBeCloseTo(1, 5)
      expect(normal.getY(i)).toBeGreaterThan(0.5)
    }
    g.dispose()
  })

  it('has a sea that ends at the waterline and a sky that surrounds the scene', () => {
    const sea = createSeaGeometry()
    sea.computeBoundingBox()
    expect(sea.boundingBox!.max.z).toBeLessThan(-40)
    expect(sea.boundingBox!.max.y).toBeLessThan(-3.5)
    const sky = createSkyGeometry()
    expect(sky.getAttribute('color').count).toBe(sky.getAttribute('position').count)
    sea.dispose()
    sky.dispose()
  })
})
