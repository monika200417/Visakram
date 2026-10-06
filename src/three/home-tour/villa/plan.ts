/**
 * The coastal villa — ONE residence, defined once. Every dimension the scene,
 * the camera path and the tests need lives here, so they can never disagree.
 * Pure TypeScript: no three.js, safe to import from the main bundle.
 *
 * Coordinates are metres. +X is east, +Y up, and the ocean lies toward −Z.
 * The ocean-facing facade is the plane z = 0, the house runs landward to
 * z = 11, and a person standing inside and facing the ocean has east on the
 * right and west on the left.
 *
 *   GROUND (z=0 is the glazed facade)           UPPER
 *   ┌────────┬────────┬─────────┬───────┐      ┌───────┬────────────┬───────┬───────┐
 *   │KITCHEN │ DINING │ LIVING  │ FOYER │      │ GUEST │ MASTER     │GALLERY│ VOID  │
 *   │x 0–6.5 │6.5–12.4│12.4–20  │ 20–24 │      │ 0–4   │ SUITE 4–16 │ 16–20 │ 20–24 │
 *   └────────┴────────┴─────────┴───────┘      └───────┴────────────┴───────┴───────┘
 *   Foyer: front door on the facade, stair along the east wall then the back wall.
 *   Outside: covered terrace and open pool deck (z 0 to −9.6), a stepped stone
 *   bluff, a planted slope, then the beach and the sea. The east side is a lawn
 *   at garden level, from which the stone entry steps rise to the porch.
 *
 * The villa is a reinforced-concrete frame: slabs 0.35 m, a 2.8 m terrace
 * cantilever (span-to-depth 8), stone-clad masses, timber soffits and
 * black-framed glass. Deliberately unbranded — no signage anywhere.
 */

export type Vec3 = readonly [number, number, number]
export type Range = readonly [number, number]

// ------------------------------------------------------------------- levels
/** Finished ground floor, above the garden grade (4 risers of 0.15 m). */
export const FL0 = 0.6
/** Floor-to-floor height. */
export const STOREY = 3.5
export const FL1 = FL0 + STOREY
/** Concrete slab thickness. */
export const SLAB = 0.35
/** Underside of the first-floor slab. */
export const CEIL0 = FL1 - SLAB
/** Underside of the roof slab (upper clear height 3.05 m). */
export const CEIL1 = 7.15
export const ROOF_TOP = CEIL1 + SLAB
/** A standing person's eye height above the surface they walk on. */
export const EYE = 1.65

// -------------------------------------------------------------- the building
export const HOUSE = { x: [0, 24], z: [0, 11] } as const satisfies { x: Range; z: Range }
export const WALL = 0.3

/** Where the stair/foyer core begins (open to the living room on its west). */
export const CORE_X0 = 20
/** The ocean terrace's cantilever beyond the facade. */
export const TERRACE_DEPTH = 2.8
/** The roof overhang beyond the facade over the upper terrace. */
export const ROOF_OVERHANG = 2.0
/** Height of every glass balustrade. */
export const RAIL_H = 1.1

export const rooms = {
  kitchen: { level: 0, x: [0, 6.5], z: [0, 11] },
  dining: { level: 0, x: [6.5, 12.4], z: [0, 11] },
  living: { level: 0, x: [12.4, CORE_X0], z: [0, 11] },
  foyer: { level: 0, x: [CORE_X0, 24], z: [0, 11] },
  guest: { level: 1, x: [0, 4], z: [0, 11] },
  suite: { level: 1, x: [4, 16], z: [0, 11] },
  gallery: { level: 1, x: [16, CORE_X0], z: [0, 11] },
} as const satisfies Record<string, { level: number; x: Range; z: Range }>

/** The stone-clad wing: full height, projecting to the terrace's depth. */
export const WING = { x: [-WALL, 4], z: [-TERRACE_DEPTH, 0] } as const

// -------------------------------------------------------------------- doors
/** Tall timber pivot door in the stone/glass frontage of the core. */
export const FRONT_DOOR = { x: [20.9, 22.3], height: 3.1 } as const
/** The living room's sliding glass, shown fully open. */
export const LIVING_SLIDER = { x: [13.4, 18.4] } as const
/** The master suite's sliding glass to the terrace; it opens during the tour. */
export const SUITE_SLIDER = { x: [7.4, 12.4] } as const
/** The door between the gallery and the suite. */
export const SUITE_DOOR = { z: [6.9, 8.3], height: 2.4 } as const

// -------------------------------------------------------------------- stair
/**
 * An L-shaped timber stair in the core: ten risers up the east wall, a square
 * landing in the back corner, ten risers west along the back wall to the
 * first-floor slab. Both flights are 1.3 m wide and clad by a timber slat wall.
 */
export const STAIR = {
  width: 1.3,
  riser: 0.175,
  tread: 0.28,
  /** Risers per flight; the last riser of a flight lands on the landing/floor. */
  risers: 10,
  /** Flight 1 spans x of [flight1X0, flight1X0 + width]. */
  flight1X0: 22.52,
  /** The back of the stair; the slat wall is 0.1 m deep inside this. */
  backZ: 10.9,
} as const

const FLIGHT_RUN = (STAIR.risers - 1) * STAIR.tread
/** Flight 1 starts here (z of its first riser face). */
export const STAIR_Z0 = STAIR.backZ - STAIR.width - FLIGHT_RUN
export const STAIR_LANDING_Y = FL0 + STAIR.risers * STAIR.riser
/** Flight 2 runs west from the landing; its last tread ends here. */
export const STAIR_X_TOP = STAIR.flight1X0 - FLIGHT_RUN

/** The walking surface of the stair at (x, z), or null off the stair. */
export function stairSurfaceAt(x: number, z: number): number | null {
  const x1 = STAIR.flight1X0 + STAIR.width
  const zLanding = STAIR.backZ - STAIR.width
  if (x >= STAIR.flight1X0 && x <= x1) {
    if (z >= zLanding && z <= STAIR.backZ) return STAIR_LANDING_Y
    if (z >= STAIR_Z0 && z < zLanding) {
      const k = Math.min(STAIR.risers - 1, Math.floor((z - STAIR_Z0) / STAIR.tread) + 1)
      return FL0 + k * STAIR.riser
    }
  }
  if (z >= zLanding && z <= STAIR.backZ && x < STAIR.flight1X0 && x >= STAIR_X_TOP) {
    const j = Math.min(STAIR.risers - 1, Math.floor((STAIR.flight1X0 - x) / STAIR.tread) + 1)
    return STAIR_LANDING_Y + j * STAIR.riser
  }
  return null
}

// --------------------------------------------------------- entry, porch, site
/** Four risers of 0.15 m from the lawn to the porch (three loose treads). */
export const ENTRY_STEPS = {
  x: [20.4, 23.6],
  count: 3,
  riser: 0.15,
  tread: 0.35,
  /** z of the lowest tread's front edge. */
  z0: -1.9 - 3 * 0.35,
} as const
/** The raised stone porch under the canopy. */
export const PORCH = { x: [CORE_X0, 24 + WALL], z: [-1.9, 0] } as const
export const CANOPY = { x: [20.2, 23.9], z: [-2.2, 0], y: [3.9, 4.25] } as const

/** The stone terrace platform in front of the house, at FL0. */
export const PLATFORM = { x: [-2, CORE_X0], z: [-9.6, HOUSE.z[1] + 1] } as const
export const POOL = { x: [5, 18], z: [-8.6, -4.6], waterY: FL0 - 0.12 } as const
export const LOUNGERS = [
  { x: [12.6, 13.5], z: [-2.2, -0.4] },
  { x: [13.9, 14.8], z: [-2.2, -0.4] },
] as const

/** The beach and sea lie far below the terrace. */
export const SITE = {
  beachZ: -34,
  waterlineZ: -46,
  seaY: -3.9,
  /** Extent of the ground mesh. */
  x: [-70, 90],
  z: [-70, 45],
} as const

/** The natural grade (independent of x), falling away from the house toward the sea. */
export function terrainY(z: number): number {
  if (z >= -9.6) return 0
  if (z >= -14) return -1.4 * ((-9.6 - z) / 4.4)
  if (z >= SITE.beachZ) return -1.4 - 2.0 * ((-14 - z) / 20)
  if (z >= SITE.waterlineZ) return -3.4 - 0.5 * ((SITE.beachZ - z) / 12)
  return SITE.seaY
}

/** Ground height at (x, z): lawn, the stone platform and its steps, the slope, beach. */
export function groundY(x: number, z: number): number {
  const onPlatform = x >= PLATFORM.x[0] && x <= PLATFORM.x[1]
  if (onPlatform && z >= PLATFORM.z[0]) return FL0
  if (onPlatform && z >= -11.4) return -0.4
  return terrainY(z)
}

/**
 * The surface a person walks on at (x, y, z): the stair, the entry steps,
 * the porch, a floor of the house, the upper terrace, or the ground. `y`
 * chooses the level where levels overlap (inside the house, on the terrace).
 */
export function walkSurfaceY(x: number, y: number, z: number): number {
  const onStair = stairSurfaceAt(x, z)
  if (onStair !== null && y > FL0 + 1.2) return onStair

  if (x >= ENTRY_STEPS.x[0] && x <= ENTRY_STEPS.x[1] && z >= ENTRY_STEPS.z0 && z < -1.9) {
    const i = Math.min(ENTRY_STEPS.count, Math.floor((z - ENTRY_STEPS.z0) / ENTRY_STEPS.tread) + 1)
    return i * ENTRY_STEPS.riser
  }
  if (x >= PORCH.x[0] && x <= PORCH.x[1] && z >= PORCH.z[0] && z <= PORCH.z[1]) return FL0

  const insideHouse = x >= HOUSE.x[0] && x <= HOUSE.x[1] && z >= HOUSE.z[0] && z <= HOUSE.z[1]
  const upperFloorX = x < CORE_X0
  if (insideHouse) return y > FL1 + 0.5 && upperFloorX ? FL1 : FL0
  const onTerrace = x >= WING.x[1] && x <= CORE_X0 && z >= -TERRACE_DEPTH && z < HOUSE.z[0]
  if (onTerrace && y > FL1 + 0.5) return FL1
  return groundY(x, z)
}
