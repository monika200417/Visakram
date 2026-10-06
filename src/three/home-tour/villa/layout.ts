/**
 * The villa as boxes — walls, slabs, glass and its black frames, timber soffits
 * and slat walls, the stair, the pool structure, large furniture and the entry —
 * generated from the dimensions in plan.ts. The 3D scene merges these per zone
 * and material; the camera tests read the `solid` ones as obstacles, so the
 * camera path and the geometry it must avoid cannot drift apart.
 * Pure TypeScript: no three.js import.
 */
import {
  CANOPY,
  CEIL0,
  CEIL1,
  CORE_X0,
  ENTRY_STEPS,
  FL0,
  FL1,
  FRONT_DOOR,
  HOUSE,
  LIVING_SLIDER,
  LOUNGERS,
  PLATFORM,
  POOL,
  PORCH,
  RAIL_H,
  ROOF_OVERHANG,
  ROOF_TOP,
  rooms,
  STAIR,
  STAIR_LANDING_Y,
  STAIR_Z0,
  SUITE_DOOR,
  SUITE_SLIDER,
  TERRACE_DEPTH,
  WALL,
  WING,
  type Range,
  type Vec3,
} from './plan'

export type Mat =
  | 'stone'
  | 'plaster'
  | 'concrete'
  | 'timber'
  | 'timberDark'
  | 'glass'
  | 'metal'
  | 'floorStone'
  | 'paving'
  | 'fabric'
  | 'fabricDark'
  | 'linen'
  | 'marble'
  | 'copper'
  | 'poolLining'
  | 'water'

/**
 * Zones group parts for merging and for culling. `shell` and `site` are always
 * drawn; the rest are hidden only where they truly cannot be seen (see
 * `hiddenIn` in the scene and `regionAt` below).
 */
export type ZoneId =
  | 'site'
  | 'shell'
  | 'foyer'
  | 'stair'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'gallery'
  | 'suite'
  | 'terraceUp'

/** `site` = ground works and finished surfaces; `frame`/`trim` = detail that is never an obstacle. */
export type Role =
  'wall' | 'glass' | 'slab' | 'rail' | 'furniture' | 'stair' | 'site' | 'frame' | 'trim'

export type Box = {
  id: string
  zone: ZoneId
  mat: Mat
  role: Role
  min: Vec3
  max: Vec3
  /** An obstacle for the camera-clearance checks. */
  solid: boolean
  /** Texture tile size in metres. */
  uv?: number
}

export const parts: Box[] = []

const SOLID_ROLES: ReadonlySet<Role> = new Set(['wall', 'glass', 'slab', 'rail', 'furniture'])

type Opts = { solid?: boolean; uv?: number }

function add(
  id: string,
  zone: ZoneId,
  mat: Mat,
  role: Role,
  x: Range,
  y: Range,
  z: Range,
  opts: Opts = {},
) {
  parts.push({
    id,
    zone,
    mat,
    role,
    min: [x[0], y[0], z[0]],
    max: [x[1], y[1], z[1]],
    solid: opts.solid ?? SOLID_ROLES.has(role),
    ...(opts.uv ? { uv: opts.uv } : {}),
  })
}

type Opening = { u: Range; v: Range }
type Face = { u: Range; v: Range }

/** Splits a wall's face (u × v) into the pieces around its openings. */
function carve(u: Range, v: Range, openings: readonly Opening[]): Face[] {
  const sorted = [...openings].sort((a, b) => a.u[0] - b.u[0])
  const segments: Face[] = []
  let cursor = u[0]
  for (const o of sorted) {
    if (o.u[0] > cursor) segments.push({ u: [cursor, o.u[0]], v })
    if (o.v[0] > v[0]) segments.push({ u: o.u, v: [v[0], o.v[0]] })
    if (o.v[1] < v[1]) segments.push({ u: o.u, v: [o.v[1], v[1]] })
    cursor = o.u[1]
  }
  if (cursor < u[1]) segments.push({ u: [cursor, u[1]], v })
  return segments
}

/** A wall in a plane x = const, with openings along z. */
function wallAlong(
  id: string,
  zone: ZoneId,
  mat: Mat,
  role: Role,
  x: Range,
  z: Range,
  y: Range,
  openings: readonly Opening[] = [],
  opts: Opts = {},
) {
  carve(z, y, openings).forEach((s, i) => add(`${id}.${i}`, zone, mat, role, x, s.v, s.u, opts))
}

const clamp = (lo: number, hi: number, v: number) => Math.min(hi, Math.max(lo, v))

/**
 * A facade-parallel glass wall with black aluminium frames: every glass panel
 * gets a perimeter frame plus intermediate mullions (≤1.7 m apart) and
 * transoms (≤3.3 m apart); a head rail runs across any full-height opening.
 */
function glassWall(
  id: string,
  zone: ZoneId,
  z: Range,
  x: Range,
  y: Range,
  openings: readonly Opening[] = [],
) {
  const frameZ: Range = [(z[0] + z[1]) / 2 - 0.06, (z[0] + z[1]) / 2 + 0.06]
  carve(x, y, openings).forEach((s, i) => {
    add(`${id}.glass.${i}`, zone, 'glass', 'glass', s.u, s.v, z)
    const w = s.u[1] - s.u[0]
    const h = s.v[1] - s.v[0]
    const nx = Math.max(1, Math.ceil(w / 1.7))
    const ny = Math.max(1, Math.ceil(h / 3.3))
    for (let a = 0; a <= nx; a++) {
      const u = s.u[0] + (w * a) / nx
      add(
        `${id}.mullion.${i}.${a}`,
        zone,
        'metal',
        'frame',
        [clamp(s.u[0], s.u[1], u - 0.03), clamp(s.u[0], s.u[1], u + 0.03)],
        s.v,
        frameZ,
      )
    }
    for (let b = 0; b <= ny; b++) {
      const v = s.v[0] + (h * b) / ny
      add(
        `${id}.transom.${i}.${b}`,
        zone,
        'metal',
        'frame',
        s.u,
        [clamp(s.v[0], s.v[1], v - 0.04), clamp(s.v[0], s.v[1], v + 0.04)],
        frameZ,
      )
    }
  })
  for (const o of openings) {
    if (o.v[1] >= y[1] - 1e-9)
      add(`${id}.head.${o.u[0]}`, zone, 'metal', 'frame', o.u, [y[1] - 0.1, y[1]], frameZ)
  }
}

/** Vertical timber slats (pitch 0.1 m, 0.05 m wide) standing proud of a wall face. */
function slats(id: string, zone: ZoneId, axis: 'x' | 'z', along: Range, face: Range, y: Range) {
  const n = Math.floor((along[1] - along[0]) / 0.1)
  for (let i = 0; i < n; i++) {
    const a = along[0] + 0.05 + i * 0.1
    const u: Range = [a - 0.025, a + 0.025]
    if (axis === 'x') add(`${id}.${i}`, zone, 'timber', 'trim', face, y, u)
    else add(`${id}.${i}`, zone, 'timber', 'trim', u, y, face)
  }
}

const X0 = HOUSE.x[0]
const X1 = HOUSE.x[1]
const Z1 = HOUSE.z[1]

// ================================================================== SITE
// The stone terrace platform, with the pool's opening cut out of it
const poolPit = {
  x: [POOL.x[0] - 0.25, POOL.x[1] + 0.25],
  z: [POOL.z[0] - 0.25, POOL.z[1] + 0.25],
} as const
const troughZ: Range = [poolPit.z[0] - 0.45, poolPit.z[0]]
const deckY: Range = [-0.4, FL0]
add('deck.north', 'site', 'paving', 'site', PLATFORM.x, deckY, [PLATFORM.z[0], troughZ[0]], {
  uv: 2.4,
})
add('deck.house', 'site', 'paving', 'site', PLATFORM.x, deckY, [poolPit.z[1], 0], { uv: 2.4 })
add(
  'deck.west',
  'site',
  'paving',
  'site',
  [PLATFORM.x[0], poolPit.x[0]],
  deckY,
  [troughZ[0], poolPit.z[1]],
  { uv: 2.4 },
)
add(
  'deck.east',
  'site',
  'paving',
  'site',
  [poolPit.x[1], PLATFORM.x[1]],
  deckY,
  [troughZ[0], poolPit.z[1]],
  { uv: 2.4 },
)

// The pool: a concrete basin lined pale, an infinity edge toward the sea, a catch trough beyond it
const floorY = POOL.waterY - 1.4
add(
  'pool.floor',
  'site',
  'stone',
  'site',
  [poolPit.x[0], poolPit.x[1]],
  [floorY - 0.25, floorY],
  [troughZ[0], poolPit.z[1]],
)
add('pool.lining', 'site', 'poolLining', 'site', POOL.x, [floorY, floorY + 0.02], POOL.z)
add(
  'pool.wall.west',
  'site',
  'poolLining',
  'site',
  [poolPit.x[0], POOL.x[0]],
  [floorY, FL0 - 0.03],
  [poolPit.z[0], poolPit.z[1]],
)
add(
  'pool.wall.east',
  'site',
  'poolLining',
  'site',
  [POOL.x[1], poolPit.x[1]],
  [floorY, FL0 - 0.03],
  [poolPit.z[0], poolPit.z[1]],
)
add(
  'pool.wall.house',
  'site',
  'poolLining',
  'site',
  POOL.x,
  [floorY, FL0 - 0.03],
  [POOL.z[1], poolPit.z[1]],
)
add(
  'pool.wall.edge',
  'site',
  'poolLining',
  'site',
  POOL.x,
  [floorY, POOL.waterY - 0.02],
  [poolPit.z[0], POOL.z[0]],
)
add(
  'pool.coping.west',
  'site',
  'paving',
  'site',
  [poolPit.x[0], POOL.x[0]],
  [FL0 - 0.03, FL0],
  [poolPit.z[0], poolPit.z[1]],
  { uv: 2.4 },
)
add(
  'pool.coping.east',
  'site',
  'paving',
  'site',
  [POOL.x[1], poolPit.x[1]],
  [FL0 - 0.03, FL0],
  [poolPit.z[0], poolPit.z[1]],
  { uv: 2.4 },
)
add(
  'pool.coping.house',
  'site',
  'paving',
  'site',
  POOL.x,
  [FL0 - 0.03, FL0],
  [POOL.z[1], poolPit.z[1]],
  { uv: 2.4 },
)
add(
  'pool.trough',
  'site',
  'stone',
  'site',
  [poolPit.x[0], poolPit.x[1]],
  [POOL.waterY - 0.7, POOL.waterY - 0.45],
  troughZ,
)
add('pool.water', 'site', 'water', 'site', POOL.x, [POOL.waterY - 0.02, POOL.waterY], POOL.z, {
  solid: false,
})

// Stone retaining walls and the lower terrace: the bluff steps down in two stages
add('retain.east', 'site', 'stone', 'site', [CORE_X0, CORE_X0 + WALL], [-1.4, FL0], [-12, -1.9], {
  uv: 2,
})
add('retain.step1', 'site', 'stone', 'site', PLATFORM.x, [-0.4, FL0], [-9.9, PLATFORM.z[0]], {
  uv: 2,
})
add('terrace.lower', 'site', 'stone', 'site', PLATFORM.x, [-1.4, -0.4], [-12, -9.9], { uv: 2.4 })

// The raised stone porch and the four-riser entry (three loose treads and the porch)
add('porch', 'site', 'stone', 'site', PORCH.x, [0, FL0], PORCH.z, { uv: 2 })
for (let i = 1; i <= ENTRY_STEPS.count; i++) {
  const z0 = ENTRY_STEPS.z0 + (i - 1) * ENTRY_STEPS.tread
  add(`step.${i}`, 'site', 'stone', 'site', ENTRY_STEPS.x, [0, i * ENTRY_STEPS.riser], [z0, -1.9], {
    uv: 1.2,
  })
}

// ================================================================= SHELL
add(
  'plinth',
  'shell',
  'concrete',
  'slab',
  [X0 - WALL, X1 + WALL],
  [0, FL0 - 0.04],
  [0, Z1 + WALL],
  {
    solid: false,
    uv: 3,
  },
)
add('wall.back', 'shell', 'plaster', 'wall', [X0 - WALL, X1 + WALL], [0, ROOF_TOP], [Z1, Z1 + WALL])
add('wall.west', 'shell', 'stone', 'wall', [X0 - WALL, X0], [0, ROOF_TOP], [0, Z1], { uv: 2.4 })
add('wall.east', 'shell', 'stone', 'wall', [X1, X1 + WALL], [0, ROOF_TOP], [0, Z1], { uv: 2.4 })
// The stone-clad wing: full height, projecting to the terrace's depth
add('wing', 'shell', 'stone', 'wall', WING.x, [FL0, ROOF_TOP], WING.z, { uv: 2.4 })

// First-floor slab (the stair void west of CORE_X0 kept clear), the terrace slab, the roof
add('slab.upper', 'shell', 'concrete', 'slab', [X0 - WALL, CORE_X0], [CEIL0, FL1], [0, Z1 + WALL], {
  uv: 3,
})
add(
  'slab.terrace',
  'shell',
  'concrete',
  'slab',
  [WING.x[1], CORE_X0],
  [CEIL0, FL1],
  [-TERRACE_DEPTH, 0],
  { uv: 3 },
)
add(
  'roof.main',
  'shell',
  'concrete',
  'slab',
  [X0 - WALL, X1 + WALL],
  [CEIL1, ROOF_TOP],
  [0, Z1 + WALL],
  { uv: 3 },
)
add(
  'roof.front',
  'shell',
  'concrete',
  'slab',
  [WING.x[1], X1 + WALL],
  [CEIL1, ROOF_TOP],
  [-ROOF_OVERHANG, 0],
  { uv: 3 },
)

// Black aluminium fascias on the slab, roof and canopy edges
add(
  'fascia.terrace',
  'shell',
  'metal',
  'trim',
  [WING.x[1], CORE_X0],
  [CEIL0, FL1],
  [-TERRACE_DEPTH - 0.04, -TERRACE_DEPTH],
)
add(
  'fascia.roof',
  'shell',
  'metal',
  'trim',
  [WING.x[1], X1 + WALL],
  [CEIL1, ROOF_TOP],
  [-ROOF_OVERHANG - 0.04, -ROOF_OVERHANG],
)
add('fascia.canopy', 'shell', 'metal', 'trim', CANOPY.x, CANOPY.y, [
  CANOPY.z[0] - 0.04,
  CANOPY.z[0],
])

// Timber soffits: under the covered terrace, the roof overhang and the canopy
add(
  'soffit.terrace',
  'shell',
  'timber',
  'trim',
  [WING.x[1], CORE_X0],
  [CEIL0 - 0.05, CEIL0],
  [-TERRACE_DEPTH, 0],
  { uv: 1.2 },
)
add(
  'soffit.roof',
  'shell',
  'timber',
  'trim',
  [WING.x[1], X1],
  [CEIL1 - 0.05, CEIL1],
  [-ROOF_OVERHANG, 0],
  { uv: 1.2 },
)
add(
  'soffit.canopy',
  'shell',
  'timber',
  'trim',
  CANOPY.x,
  [CANOPY.y[0] - 0.04, CANOPY.y[0]],
  CANOPY.z,
  { uv: 1.2 },
)

// Ground-floor facade: floor-to-ceiling black-framed glass; the living slider stands open
glassWall(
  'facade.ground',
  'shell',
  [-0.03, 0.03],
  [WING.x[1], CORE_X0],
  [FL0, CEIL0],
  [{ u: LIVING_SLIDER.x, v: [FL0, CEIL0] }],
)
// The living room's slider stands open: two panes stacked on the fixed glass, one per track
for (const z of [0.12, -0.12]) {
  const track: Range = [z - 0.01, z + 0.01]
  const frame: Range = [z - 0.025, z + 0.025]
  const px: Range = [LIVING_SLIDER.x[1], CORE_X0]
  const py: Range = [FL0 + 0.04, CEIL0 - 0.1]
  add(`living.pane.${z}.glass`, 'shell', 'glass', 'glass', px, py, track, { solid: false })
  add(`living.pane.${z}.top`, 'shell', 'metal', 'frame', px, [py[1] - 0.05, py[1]], frame)
  add(`living.pane.${z}.bottom`, 'shell', 'metal', 'frame', px, [py[0], py[0] + 0.05], frame)
  add(`living.pane.${z}.left`, 'shell', 'metal', 'frame', [px[0], px[0] + 0.05], py, frame)
  add(`living.pane.${z}.right`, 'shell', 'metal', 'frame', [px[1] - 0.05, px[1]], py, frame)
}
// The core's frontage: a stone pier, the door opening, tall glass beside and above it
add(
  'core.pier',
  'shell',
  'stone',
  'wall',
  [CORE_X0, FRONT_DOOR.x[0]],
  [FL0, ROOF_TOP],
  [-WALL, 0],
  { uv: 2.4 },
)
glassWall(
  'core',
  'shell',
  [-0.03, 0.03],
  [FRONT_DOOR.x[0], X1],
  [FL0, CEIL1],
  [{ u: FRONT_DOOR.x, v: [FL0, FL0 + FRONT_DOOR.height] }],
)
add('canopy', 'shell', 'timber', 'slab', CANOPY.x, CANOPY.y, CANOPY.z, { uv: 1.2 })
// Upper facade glass: the suite's slider opens, the gallery is fixed
glassWall(
  'facade.upper',
  'shell',
  [-0.03, 0.03],
  [WING.x[1], CORE_X0],
  [FL1, CEIL1],
  [{ u: SUITE_SLIDER.x, v: [FL1, CEIL1] }],
)

// ============================================================= TERRACES
const railTop = FL1 + RAIL_H
const railZ: Range = [-TERRACE_DEPTH + 0.15, -TERRACE_DEPTH + 0.19]
add('rail.terrace.front', 'terraceUp', 'glass', 'rail', [WING.x[1], CORE_X0], [FL1, railTop], railZ)
add(
  'rail.terrace.cap',
  'terraceUp',
  'metal',
  'trim',
  [WING.x[1], CORE_X0],
  [railTop, railTop + 0.04],
  [railZ[0] - 0.02, railZ[1] + 0.02],
)
add(
  'rail.terrace.end',
  'terraceUp',
  'glass',
  'rail',
  [CORE_X0 - 0.04, CORE_X0],
  [FL1, railTop],
  [-TERRACE_DEPTH, 0],
)
add(
  'rail.terrace.endcap',
  'terraceUp',
  'metal',
  'trim',
  [CORE_X0 - 0.06, CORE_X0 + 0.02],
  [railTop, railTop + 0.04],
  [-TERRACE_DEPTH, 0],
)
add(
  'terrace.deck',
  'terraceUp',
  'timber',
  'trim',
  [WING.x[1], CORE_X0],
  [FL1, FL1 + 0.02],
  [-TERRACE_DEPTH, 0],
  { uv: 1.2 },
)
LOUNGERS.forEach((l, i) =>
  add(`terrace.lounger.${i}`, 'terraceUp', 'linen', 'furniture', l.x, [FL1 + 0.02, FL1 + 0.4], l.z),
)

// ================================================================= FOYER
// The stone return of the facade into the room; the rest of the core is open to the living room
add('foyer.return', 'foyer', 'stone', 'wall', [CORE_X0, CORE_X0 + WALL], [FL0, CEIL0], [0, 2.2], {
  uv: 2.4,
})
add('foyer.floor', 'foyer', 'floorStone', 'site', [CORE_X0, X1], [FL0 - 0.04, FL0], [0, Z1], {
  uv: 2.4,
})
add('foyer.ceiling', 'foyer', 'timber', 'trim', [CORE_X0, X1], [CEIL1 - 0.05, CEIL1], [0, Z1], {
  uv: 1.2,
})

// ================================================================= STAIR
const { riser, tread, width } = STAIR
const x1Stair = STAIR.flight1X0 + width
const zLanding = STAIR.backZ - width
// Timber slat walls: a dark backing with slats on the stair's east and back faces
add(
  'stair.wall.east',
  'stair',
  'timberDark',
  'wall',
  [x1Stair + 0.08, X1],
  [FL0, CEIL1],
  [STAIR_Z0, Z1],
)
slats(
  'stair.slats.east',
  'stair',
  'x',
  [STAIR_Z0, STAIR.backZ],
  [x1Stair + 0.04, x1Stair + 0.08],
  [FL0, CEIL1],
)
add(
  'stair.wall.back',
  'stair',
  'timberDark',
  'wall',
  [CORE_X0, X1],
  [FL0, CEIL1],
  [STAIR.backZ + 0.04, Z1],
)
slats(
  'stair.slats.back',
  'stair',
  'z',
  [CORE_X0, x1Stair + 0.08],
  [STAIR.backZ, STAIR.backZ + 0.04],
  [FL0, CEIL1],
)

// Each flight is a folded timber plate 0.3 m thick (stepped soffit, closed risers)
const plate = 0.3
for (let k = 1; k < STAIR.risers; k++) {
  const top = FL0 + k * riser
  const z0 = STAIR_Z0 + (k - 1) * tread
  add(
    `stair.1.${k}`,
    'stair',
    'timber',
    'stair',
    [STAIR.flight1X0, x1Stair],
    [Math.max(FL0, top - plate), top],
    [z0, z0 + tread],
    { uv: 1.2 },
  )
  add(
    `stair.1.rail.${k}`,
    'stair',
    'glass',
    'rail',
    [STAIR.flight1X0 - 0.04, STAIR.flight1X0],
    [top, top + 0.95],
    [z0, z0 + tread],
  )
  const topJ = STAIR_LANDING_Y + k * riser
  const xa = STAIR.flight1X0 - k * tread
  add(
    `stair.2.${k}`,
    'stair',
    'timber',
    'stair',
    [xa, xa + tread],
    [topJ - plate, topJ],
    [zLanding, STAIR.backZ],
    { uv: 1.2 },
  )
  add(
    `stair.2.rail.${k}`,
    'stair',
    'glass',
    'rail',
    [xa, xa + tread],
    [topJ, topJ + 0.95],
    [zLanding - 0.04, zLanding],
  )
}
add(
  'stair.landing',
  'stair',
  'timber',
  'stair',
  [STAIR.flight1X0, x1Stair],
  [STAIR_LANDING_Y - plate, STAIR_LANDING_Y],
  [zLanding, STAIR.backZ],
  { uv: 1.2 },
)
// The landing's free corner is carried by a slim black steel post
add(
  'stair.post',
  'stair',
  'metal',
  'trim',
  [STAIR.flight1X0 - 0.1, STAIR.flight1X0],
  [FL0, STAIR_LANDING_Y - plate],
  [zLanding - 0.1, zLanding],
)

// ========================================================== OPEN-PLAN ROOMS
for (const room of ['kitchen', 'dining', 'living'] as const) {
  add(`${room}.floor`, room, 'floorStone', 'site', rooms[room].x, [FL0 - 0.04, FL0], [0, Z1], {
    uv: 2.4,
  })
  // A timber ceiling band along the glazing, continuing the soffit outside
  add(`${room}.ceiling`, room, 'timber', 'trim', rooms[room].x, [CEIL0 - 0.05, CEIL0], [0, 3.2], {
    uv: 1.2,
  })
}

// ============================================================== GALLERY
add('gallery.floor', 'gallery', 'floorStone', 'site', [16, CORE_X0], [FL1, FL1 + 0.02], [0, Z1], {
  uv: 2.4,
})
add('gallery.ceiling', 'gallery', 'timber', 'trim', [16, CORE_X0], [CEIL1 - 0.05, CEIL1], [0, Z1], {
  uv: 1.2,
})
add(
  'gallery.rail.void',
  'gallery',
  'glass',
  'rail',
  [CORE_X0 - 0.04, CORE_X0],
  [FL1, railTop],
  [0, zLanding - 0.05],
)
add(
  'gallery.rail.cap',
  'gallery',
  'metal',
  'trim',
  [CORE_X0 - 0.06, CORE_X0 + 0.02],
  [railTop, railTop + 0.04],
  [0, zLanding - 0.05],
)

// ================================================================== SUITE
// The wall between gallery and suite (with its door) and the slatted feature wall behind the bed
wallAlong(
  'suite.wall.east',
  'suite',
  'plaster',
  'wall',
  [16, 16.2],
  [0, Z1],
  [FL1, CEIL1],
  [{ u: SUITE_DOOR.z, v: [FL1, FL1 + SUITE_DOOR.height] }],
)
add('suite.wall.west', 'suite', 'timberDark', 'wall', [4, 4.2], [FL1, CEIL1], [0, Z1])
slats('suite.slats.west', 'suite', 'x', [0, Z1], [4.2, 4.26], [FL1, CEIL1])
// En-suite volume and wardrobe along the back
add('suite.bath.east', 'suite', 'plaster', 'wall', [8.4, 8.5], [FL1, CEIL1], [8.4, Z1])
add('suite.bath.front', 'suite', 'plaster', 'wall', [4.2, 8.4], [FL1, CEIL1], [8.4, 8.5])
add('suite.floor', 'suite', 'floorStone', 'site', [4.2, 16], [FL1, FL1 + 0.02], [0, Z1], {
  uv: 2.4,
})
add('suite.ceiling', 'suite', 'timber', 'trim', [4.2, 16], [CEIL1 - 0.05, CEIL1], [0, Z1], {
  uv: 1.2,
})

// ================================================ LARGE FURNITURE (obstacles)
const furniture = (id: string, zone: ZoneId, mat: Mat, x: Range, z: Range, h: number, base = FL0) =>
  add(id, zone, mat, 'furniture', x, [base, base + h], z)
const rug = (id: string, zone: ZoneId, x: Range, z: Range, base: number) =>
  add(id, zone, 'fabric', 'trim', x, [base, base + 0.015], z)

// Living: L-shaped sofa facing the ocean, chaise return, coffee table, console, rug
rug('living.rug', 'living', [13.6, 18.2], [1.4, 5.6], FL0)
furniture('living.sofa', 'living', 'fabric', [14.2, 17.8], [4.0, 5.0], 0.85)
furniture('living.chaise', 'living', 'fabric', [14.2, 15.2], [2.2, 4.0], 0.45)
furniture('living.table', 'living', 'timber', [15.6, 16.9], [2.5, 3.5], 0.38)
furniture('living.console', 'living', 'timber', [13, 18], [10.35, 10.95], 0.8)
// Dining: a long timber table, eight chairs, three copper pendants
furniture('dining.table', 'dining', 'timber', [8.2, 11.8], [1.7, 3.1], 0.76)
for (const x of [8.9, 10.0, 11.1]) {
  furniture(`dining.chair.n.${x}`, 'dining', 'fabricDark', [x - 0.25, x + 0.25], [1.1, 1.6], 0.9)
  furniture(`dining.chair.s.${x}`, 'dining', 'fabricDark', [x - 0.25, x + 0.25], [3.2, 3.7], 0.9)
  add(
    `dining.cord.${x}`,
    'dining',
    'metal',
    'trim',
    [x - 0.005, x + 0.005],
    [3.0, CEIL0 - 0.05],
    [2.395, 2.405],
  )
  add(
    `dining.pendant.${x}`,
    'dining',
    'copper',
    'trim',
    [x - 0.17, x + 0.17],
    [2.65, 3.0],
    [2.23, 2.57],
  )
}
furniture('dining.chair.w', 'dining', 'fabricDark', [7.6, 8.1], [2.15, 2.65], 0.9)
furniture('dining.chair.e', 'dining', 'fabricDark', [11.9, 12.4], [2.15, 2.65], 0.9)
// Kitchen: marble island with stools; timber base units, tall units, stone splashback and hood
furniture('kitchen.island', 'kitchen', 'marble', [1.8, 5.6], [7.2, 8.8], 0.95)
for (const x of [2.6, 3.7, 4.8])
  furniture(`kitchen.stool.${x}`, 'kitchen', 'fabricDark', [x - 0.2, x + 0.2], [6.55, 6.95], 0.66)
furniture('kitchen.base', 'kitchen', 'timber', [1.6, 6.4], [10.35, Z1], 0.9)
furniture('kitchen.pantry.west', 'kitchen', 'timber', [0, 1.6], [10.3, Z1], 2.4)
add('kitchen.counter', 'kitchen', 'marble', 'trim', [1.6, 6.4], [FL0 + 0.9, FL0 + 0.95], [10.3, Z1])
add(
  'kitchen.splash',
  'kitchen',
  'stone',
  'trim',
  [1.6, 6.4],
  [FL0 + 0.95, FL0 + 2.1],
  [Z1 - 0.05, Z1],
)
add('kitchen.hood', 'kitchen', 'metal', 'trim', [3.0, 4.9], [FL0 + 1.95, FL0 + 2.5], [10.4, Z1])
// Suite: bed with its headboard on the slatted wall, bedside tables, wardrobe, rug
rug('suite.rug', 'suite', [4.3, 8.4], [2.6, 6.4], FL1 + 0.02)
furniture('suite.bed', 'suite', 'linen', [4.56, 6.66], [3.5, 5.4], 0.55, FL1 + 0.02)
furniture('suite.headboard', 'suite', 'timber', [4.26, 4.56], [3.4, 5.5], 1.15, FL1 + 0.02)
furniture('suite.bedside.n', 'suite', 'timber', [4.26, 4.86], [3.0, 3.4], 0.5, FL1 + 0.02)
furniture('suite.bedside.s', 'suite', 'timber', [4.26, 4.86], [5.5, 5.9], 0.5, FL1 + 0.02)
furniture('suite.wardrobe', 'suite', 'timber', [10, 16], [10.2, Z1], 2.4, FL1 + 0.02)

// ----------------------------------------------------------------- queries
export const solids: readonly Box[] = parts.filter((p) => p.solid)

/** Which part of the villa the camera is in — drives what can be culled. */
export type Region = 'exterior' | 'core' | 'ground' | 'upper'

export function regionAt(x: number, y: number, z: number): Region {
  const inside = x > X0 - 0.1 && x < X1 + 0.1 && z > 0.05 && z < Z1
  if (!inside) return 'exterior'
  if (x >= CORE_X0) return 'core'
  return y < FL1 + 0.5 ? 'ground' : 'upper'
}
