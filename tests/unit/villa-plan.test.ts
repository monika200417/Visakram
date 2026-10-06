import { describe, expect, it } from 'vitest'
import {
  CEIL0,
  CEIL1,
  CORE_X0,
  ENTRY_STEPS,
  EYE,
  FL0,
  FL1,
  FRONT_DOOR,
  HOUSE,
  LIVING_SLIDER,
  PLATFORM,
  POOL,
  RAIL_H,
  ROOF_OVERHANG,
  ROOF_TOP,
  SLAB,
  STAIR,
  STAIR_LANDING_Y,
  STAIR_X_TOP,
  STAIR_Z0,
  STOREY,
  SUITE_DOOR,
  SUITE_SLIDER,
  TERRACE_DEPTH,
  groundY,
  rooms,
  stairSurfaceAt,
  walkSurfaceY,
} from '../../src/three/home-tour/villa/plan'
import { parts, regionAt, solids } from '../../src/three/home-tour/villa/layout'

const within = (inner: readonly [number, number], outer: readonly [number, number]) =>
  inner[0] >= outer[0] - 1e-9 && inner[1] <= outer[1] + 1e-9

describe('Villa plan — structure that could actually be built', () => {
  it('has realistic storey heights and slab thickness', () => {
    expect(FL1 - FL0).toBeCloseTo(STOREY, 6)
    expect(CEIL0 - FL0).toBeGreaterThanOrEqual(3.0)
    expect(CEIL1 - FL1).toBeGreaterThanOrEqual(3.0)
    expect(SLAB).toBeGreaterThanOrEqual(0.3)
    expect(ROOF_TOP - CEIL1).toBeCloseTo(SLAB, 6)
  })

  it('keeps every cantilever modest: terrace span-to-depth ≤ 9, eaves ≤ 2.2 m', () => {
    expect(TERRACE_DEPTH).toBeLessThanOrEqual(3)
    expect(TERRACE_DEPTH / SLAB).toBeLessThanOrEqual(9)
    expect(ROOF_OVERHANG).toBeLessThanOrEqual(2.2)
    expect(ROOF_OVERHANG).toBeLessThanOrEqual(TERRACE_DEPTH)
  })

  it('has a comfortable, code-style stair that exactly spans the storey', () => {
    expect(STAIR.riser).toBeLessThanOrEqual(0.19)
    expect(STAIR.tread).toBeGreaterThanOrEqual(0.25)
    expect(2 * STAIR.riser + STAIR.tread).toBeGreaterThan(0.6)
    expect(2 * STAIR.riser + STAIR.tread).toBeLessThan(0.65)
    expect(STAIR.width).toBeGreaterThanOrEqual(1.0)
    expect(2 * STAIR.risers * STAIR.riser).toBeCloseTo(STOREY, 6)
    expect(STAIR_LANDING_Y).toBeCloseTo(FL0 + STOREY / 2, 6)
    // The last tread of the second flight is one riser below the first floor
    expect(stairSurfaceAt(STAIR_X_TOP + 0.01, STAIR.backZ - 0.5)).toBeCloseTo(FL1 - STAIR.riser, 6)
    expect(stairSurfaceAt(STAIR.flight1X0 + 0.5, STAIR_Z0 + 0.01)).toBeCloseTo(FL0 + STAIR.riser, 6)
    expect(stairSurfaceAt(STAIR.flight1X0 + 0.5, STAIR.backZ - 0.5)).toBeCloseTo(STAIR_LANDING_Y, 6)
    expect(stairSurfaceAt(5, 5)).toBeNull()
  })

  it('fits the stair inside the core, behind a foyer deep enough to arrive in', () => {
    expect(STAIR_X_TOP).toBeGreaterThanOrEqual(CORE_X0 - 1e-9)
    expect(STAIR.flight1X0 + STAIR.width).toBeLessThan(HOUSE.x[1])
    expect(STAIR_Z0).toBeGreaterThan(5)
    expect(STAIR.backZ).toBeLessThan(HOUSE.z[1])
  })

  it('tiles the ground-floor plan without gaps or overlaps, inside the footprint', () => {
    const ground = Object.values(rooms)
      .filter((r) => r.level === 0)
      .sort((a, b) => a.x[0] - b.x[0])
    expect(ground[0]!.x[0]).toBe(HOUSE.x[0])
    expect(ground[ground.length - 1]!.x[1]).toBe(HOUSE.x[1])
    ground.forEach((r, i) => {
      if (i > 0) expect(r.x[0]).toBe(ground[i - 1]!.x[1])
      expect(within(r.x, HOUSE.x)).toBe(true)
      expect(within(r.z, HOUSE.z)).toBe(true)
    })
    const upper = Object.values(rooms)
      .filter((r) => r.level === 1)
      .sort((a, b) => a.x[0] - b.x[0])
    upper.forEach((r, i) => {
      if (i > 0) expect(r.x[0]).toBe(upper[i - 1]!.x[1])
    })
    // The first floor stops at the stair void
    expect(upper[upper.length - 1]!.x[1]).toBe(CORE_X0)
  })

  it('sizes the openings so a person can use them', () => {
    expect(FRONT_DOOR.x[1] - FRONT_DOOR.x[0]).toBeGreaterThanOrEqual(1.2)
    expect(FRONT_DOOR.height).toBeLessThan(CEIL0 - FL0)
    expect(within(FRONT_DOOR.x, [CORE_X0, HOUSE.x[1]])).toBe(true)
    expect(within(LIVING_SLIDER.x, rooms.living.x)).toBe(true)
    expect(within(SUITE_SLIDER.x, rooms.suite.x)).toBe(true)
    expect(SUITE_DOOR.z[1] - SUITE_DOOR.z[0]).toBeGreaterThanOrEqual(1.0)
    expect(SUITE_DOOR.height).toBeGreaterThanOrEqual(2.1)
    expect(RAIL_H).toBeGreaterThanOrEqual(1.0)
  })

  it('reaches the porch by risers of a comfortable height', () => {
    expect((ENTRY_STEPS.count + 1) * ENTRY_STEPS.riser).toBeCloseTo(FL0, 6)
    expect(ENTRY_STEPS.riser).toBeLessThanOrEqual(0.17)
    expect(ENTRY_STEPS.tread).toBeGreaterThanOrEqual(0.3)
    expect(within(FRONT_DOOR.x, ENTRY_STEPS.x)).toBe(true)
  })

  it('places the pool on the open deck, in front of both dining and living, away from the house', () => {
    expect(within(POOL.x, PLATFORM.x)).toBe(true)
    expect(POOL.z[1]).toBeLessThan(-TERRACE_DEPTH)
    expect(POOL.z[0]).toBeGreaterThan(PLATFORM.z[0])
    expect(POOL.x[0]).toBeLessThanOrEqual(rooms.dining.x[1])
    expect(POOL.x[1]).toBeGreaterThanOrEqual(rooms.living.x[0])
    expect(POOL.x[1] - POOL.x[0]).toBeGreaterThan(10)
  })

  it('falls from the terrace to the beach and sea, away from the ocean-facing facade', () => {
    expect(groundY(12, -8)).toBe(FL0)
    expect(groundY(12, -10.5)).toBeLessThan(FL0)
    expect(groundY(12, -20)).toBeLessThan(groundY(12, -12))
    expect(groundY(12, -34)).toBeLessThan(groundY(12, -20))
    expect(groundY(12, -80)).toBeLessThan(groundY(12, -34))
    expect(groundY(40, -2)).toBe(0)
  })

  it('knows what a person walks on at each key place', () => {
    expect(walkSurfaceY(17, 2.25, 6)).toBe(FL0)
    expect(walkSurfaceY(10, 5.75, 6)).toBe(FL1)
    expect(walkSurfaceY(21.6, 2.25, -1.1)).toBe(FL0)
    expect(walkSurfaceY(9.9, 5.75, -1.2)).toBe(FL1)
    expect(walkSurfaceY(30, 2, -9)).toBe(0)
    expect(walkSurfaceY(21.6, 1.9, -2.4)).toBeCloseTo(0.3, 6)
  })

  it('classifies the camera region: outside, core, ground rooms, upper rooms', () => {
    expect(regionAt(40, 2, -14)).toBe('exterior')
    expect(regionAt(21.6, 2.25, -1.1)).toBe('exterior')
    expect(regionAt(21.6, 2.25, 3)).toBe('core')
    expect(regionAt(17, 2.25, 6)).toBe('ground')
    expect(regionAt(10, 5.75, 6)).toBe('upper')
    expect(regionAt(9.9, 5.75, -1.2)).toBe('exterior')
  })

  it('builds a sensible number of well-formed boxes', () => {
    expect(parts.length).toBeGreaterThan(60)
    expect(parts.length).toBeLessThan(900)
    expect(solids.length).toBeGreaterThan(40)
    const ids = parts.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of parts) {
      for (let a = 0; a < 3; a++) expect(p.max[a]! - p.min[a]!).toBeGreaterThan(0)
    }
  })

  it('stands a person (EYE) well under every ceiling', () => {
    expect(FL0 + EYE).toBeLessThan(CEIL0)
    expect(FL1 + EYE).toBeLessThan(CEIL1)
  })
})
