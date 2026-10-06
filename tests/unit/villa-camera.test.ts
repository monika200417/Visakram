import { describe, expect, it } from 'vitest'
import { villaChapters } from '../../src/three/home-tour/villa/chapters'
import { regionAt, solids, type Region } from '../../src/three/home-tour/villa/layout'
import { POOL, groundY, walkSurfaceY } from '../../src/three/home-tour/villa/plan'
import {
  villaTour as tour,
  villaWaypoints as waypoints,
} from '../../src/three/home-tour/villa/tour'

const SAMPLES = 6000
const deg = (rad: number) => (rad * 180) / Math.PI

type V = [number, number, number]
type Pose = { position: readonly number[]; lookAt: readonly number[]; fov: number }

function forward(p: number) {
  const s = tour.sample(p)
  const d = [s.lookAt[0] - s.position[0], s.lookAt[1] - s.position[1], s.lookAt[2] - s.position[2]]
  const len = Math.hypot(d[0]!, d[1]!, d[2]!)
  return d.map((v) => v / len) as V
}

/** Where a world point lands in a 16:9 frame: |ndc| ≤ 1 is inside, zc > 0 is in front. */
function project(s: Pose, pt: V, aspect = 16 / 9) {
  const f = [0, 1, 2].map((i) => s.lookAt[i]! - s.position[i]!) as V
  const fl = Math.hypot(...f)
  const fw = f.map((v) => v / fl) as V
  // right = forward × up(0,1,0); up' = right × forward
  const rr: V = [-fw[2], 0, fw[0]]
  const rl = Math.hypot(...rr)
  const r = rr.map((v) => v / rl) as V
  const u: V = [
    r[1] * fw[2] - r[2] * fw[1],
    r[2] * fw[0] - r[0] * fw[2],
    r[0] * fw[1] - r[1] * fw[0],
  ]
  const v = [0, 1, 2].map((i) => pt[i]! - s.position[i]!) as V
  const zc = v[0] * fw[0] + v[1] * fw[1] + v[2] * fw[2]
  const xc = v[0] * r[0] + v[1] * r[1] + v[2] * r[2]
  const yc = v[0] * u[0] + v[1] * u[1] + v[2] * u[2]
  const t = Math.tan((s.fov * Math.PI) / 360)
  return { x: xc / zc / (t * aspect), y: yc / zc / t, zc }
}
const inFrame = (s: Pose, pt: V, margin = 0.98) => {
  const r = project(s, pt)
  return r.zc > 0 && Math.abs(r.x) <= margin && Math.abs(r.y) <= margin
}

const at = (id: string) => tour.arrivalProgress[id]!

describe('Villa camera path', () => {
  it('derives one progress anchor per chapter, strictly increasing and well spread', () => {
    expect(tour.anchors).toHaveLength(villaChapters.length)
    expect(tour.chapterIds).toEqual(villaChapters.map((c) => c.id))
    tour.anchors.forEach((a, i) => {
      expect(a).toBeGreaterThan(0)
      expect(a).toBeLessThan(1)
      if (i > 0) expect(a - tour.anchors[i - 1]!).toBeGreaterThan(0.04)
    })
    expect(tour.anchors[0]!).toBeLessThan(0.1)
    expect(tour.anchors[tour.anchors.length - 1]!).toBeGreaterThan(0.9)
  })

  it('reaches every waypoint in order, never out of sequence', () => {
    const arrivals = waypoints.map((w) => at(w.id))
    arrivals.forEach((a, i) => {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThanOrEqual(1)
      if (i > 0) expect(a).toBeGreaterThan(arrivals[i - 1]!)
    })
  })

  it('maps progress to the right chapter and never skips or reverses one', () => {
    tour.anchors.forEach((a, i) => expect(tour.chapterIndexAt(a)).toBe(i))
    tour.chapterStarts.forEach((start, i) => {
      expect(start).toBeLessThanOrEqual(tour.anchors[i]!)
      if (i > 0) expect(start).toBeGreaterThan(tour.chapterStarts[i - 1]!)
    })
    expect(tour.chapterIndexAt(0)).toBe(0)
    expect(tour.chapterIndexAt(1)).toBe(villaChapters.length - 1)
    let last = 0
    for (let i = 0; i <= SAMPLES; i++) {
      const c = tour.chapterIndexAt(i / SAMPLES)
      expect(c).toBeGreaterThanOrEqual(last)
      expect(c - last).toBeLessThanOrEqual(1)
      last = c
    }
  })

  it('names each chapter where the camera actually is: staircase at the stair, final after the rail', () => {
    expect(tour.chapterIndexAt(at('stairApproach') + 1e-4)).toBe(
      tour.chapterIds.indexOf('staircase'),
    )
    expect(tour.chapterIndexAt(at('stairApproach') - 1e-3)).toBe(
      tour.chapterIds.indexOf('diningKitchen'),
    )
    expect(tour.chapterIndexAt(at('overRail') + 1e-4)).toBe(tour.chapterIds.indexOf('reveal'))
    expect(tour.chapterIndexAt(at('overRail') - 1e-3)).toBe(tour.chapterIds.indexOf('terrace'))
    // the kitchen (island) still belongs to the Dining + Kitchen chapter
    expect(tour.chapterIndexAt(at('kitchen'))).toBe(tour.chapterIds.indexOf('diningKitchen'))
    expect(tour.chapterIndexAt(at('aisleA'))).toBe(tour.chapterIds.indexOf('diningKitchen'))
  })

  it('starts and ends exactly on the first and last waypoints', () => {
    const first = waypoints[0]!
    const last = waypoints[waypoints.length - 1]!
    const a = tour.sample(0)
    const b = tour.sample(1)
    first.position.forEach((v, i) => expect(a.position[i]).toBeCloseTo(v, 3))
    last.position.forEach((v, i) => expect(b.position[i]).toBeCloseTo(v, 3))
  })

  it('never cuts: position, view direction and lens change smoothly between samples', () => {
    let maxStep = 0
    let maxTurn = 0
    let maxFov = 0
    let previous = tour.sample(0)
    let previousForward = forward(0)
    for (let i = 1; i <= SAMPLES; i++) {
      const p = i / SAMPLES
      const s = tour.sample(p)
      maxStep = Math.max(
        maxStep,
        Math.hypot(
          s.position[0] - previous.position[0],
          s.position[1] - previous.position[1],
          s.position[2] - previous.position[2],
        ),
      )
      const f = forward(p)
      const dot = f[0] * previousForward[0] + f[1] * previousForward[1] + f[2] * previousForward[2]
      maxTurn = Math.max(maxTurn, deg(Math.acos(Math.min(1, dot))))
      maxFov = Math.max(maxFov, Math.abs(s.fov - previous.fov))
      previous = s
      previousForward = f
    }
    expect(maxStep).toBeLessThan(0.15)
    expect(maxTurn).toBeLessThan(0.7)
    expect(maxFov).toBeLessThan(0.1)
  })

  it('turns the view gently: no more than 30° of rotation per 1% of scroll', () => {
    const window = SAMPLES / 100
    const dirs = Array.from({ length: SAMPLES + 1 }, (_, i) => forward(i / SAMPLES))
    let worst = 0
    for (let i = 0; i + window <= SAMPLES; i += 5) {
      const a = dirs[i]!
      const b = dirs[i + window]!
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
      worst = Math.max(worst, deg(Math.acos(Math.min(1, dot))))
    }
    expect(worst).toBeLessThan(30)
  })

  it('lingers on each chapter: the camera is slower at an anchor than on average', () => {
    const speed = (p: number) => {
      const e = 0.0006
      const a = tour.sample(p - e).position
      const b = tour.sample(p + e).position
      return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / (2 * e)
    }
    const mean = tour.pathLength / 1
    tour.anchors.forEach((a) => expect(speed(a)).toBeLessThan(mean * 0.35))
  })

  it('moves quickest on the service lane back to the stair (scroll per metre is lowest there)', () => {
    const lanePerMetre = (at('aisleD') - at('aisleB')) / Math.hypot(16 - 6.5, 9.0 - 9.5)
    const islandLength = Math.hypot(1.0 - 3.4, 6.3 - 5.1) + Math.hypot(0.9 - 1.0, 8.9 - 6.3)
    const islandPerMetre = (at('islandC') - at('islandA')) / islandLength
    expect(lanePerMetre).toBeLessThan(islandPerMetre / 2)
  })

  it('walks through openings only: never through a wall, slab, glass, rail or large furnishing', () => {
    const bodied = new Set(['wall', 'glass', 'furniture', 'rail'])
    const margin = 0.3
    const offenders: string[] = []
    const walkEnd = tour.anchors[tour.chapterIds.indexOf('terrace')]!
    for (let i = 0; i <= 5000; i++) {
      const p = i / 5000
      const [x, y, z] = tour.sample(p).position
      for (const s of solids) {
        const horizontally =
          x > s.min[0] - margin &&
          x < s.max[0] + margin &&
          z > s.min[2] - margin &&
          z < s.max[2] + margin
        if (!horizontally) continue
        // Walking: the whole standing body (feet to just above the eye) must clear it.
        // Afterwards the camera flies, so only the lens point (with a small margin) must.
        const hits =
          p <= walkEnd && bodied.has(s.role)
            ? s.min[1] < y + 0.1 && s.max[1] > y - 1.5
            : y > s.min[1] - 0.22 && y < s.max[1] + 0.22
        if (hits) offenders.push(`p=${p.toFixed(3)} in ${s.id}`)
      }
    }
    expect(offenders.slice(0, 5)).toEqual([])
  })

  it('keeps a believable eye height above whatever it walks on, and never goes underground', () => {
    const walkEnd = tour.anchors[tour.chapterIds.indexOf('terrace')]!
    const approachEnd = at('approachB')
    const offenders: string[] = []
    for (let i = 0; i <= 5000; i++) {
      const p = i / 5000
      const [x, y, z] = tour.sample(p).position
      const surface = walkSurfaceY(x, y, z)
      const eye = y - surface
      if (p <= approachEnd) {
        // the establishing shot is a little above the lawn
        if (eye < 1.6 || eye > 4.4) offenders.push(`p=${p.toFixed(3)} eye=${eye.toFixed(2)}`)
      } else if (p <= walkEnd) {
        if (eye < 1.35 || eye > 2.0) offenders.push(`p=${p.toFixed(3)} eye=${eye.toFixed(2)}`)
      } else if (y < groundY(x, z) + 4) {
        // the crane rises clear of the ground
        offenders.push(`p=${p.toFixed(3)} low`)
      }
    }
    expect(offenders.slice(0, 5)).toEqual([])
  })

  it('moves through the villa in order: outside, entry, rooms, stair, upper floor, terrace, out', () => {
    const region = (id: string): Region => {
      const s = tour.sample(
        tour.chapterIds.includes(id) ? tour.anchors[tour.chapterIds.indexOf(id)]! : at(id),
      )
      return regionAt(s.position[0], s.position[1], s.position[2])
    }
    expect(region('exterior')).toBe('exterior')
    expect(region('entry')).toBe('exterior')
    expect(region('living')).toBe('ground')
    expect(region('diningKitchen')).toBe('ground')
    expect(region('staircase')).toBe('core')
    expect(region('bedroom')).toBe('upper')
    expect(region('terrace')).toBe('exterior')
    expect(region('reveal')).toBe('exterior')

    // No flicker: the region changes only a handful of times over the whole journey
    let changes = 0
    let last = region('exterior')
    for (let i = 0; i <= SAMPLES; i++) {
      const [x, y, z] = tour.sample(i / SAMPLES).position
      const r = regionAt(x, y, z)
      if (r !== last) changes++
      last = r
    }
    expect(changes).toBeLessThanOrEqual(12)
  })

  it('ends somewhere new: a high, wide view of the same villa, not the opening position', () => {
    const a = tour.sample(0)
    const b = tour.sample(1)
    expect(
      Math.hypot(
        b.position[0] - a.position[0],
        b.position[1] - a.position[1],
        b.position[2] - a.position[2],
      ),
    ).toBeGreaterThan(40)
    expect(b.position[1]).toBeGreaterThan(a.position[1] + 5)
    expect(b.fov).toBeGreaterThan(a.fov - 1)
    expect(b.fov).toBeLessThanOrEqual(40) // no wide-angle distortion

    // The final composition holds the whole villa, the pool, the entry core, the
    // stone wing, the upper terrace and the beach in one frame.
    const frame: Array<[string, V]> = [
      ['villa', [12, 3.5, 5.5]],
      ['pool', [(POOL.x[0] + POOL.x[1]) / 2, 0.6, (POOL.z[0] + POOL.z[1]) / 2]],
      ['core', [22, 3.5, 5.5]],
      ['wing', [2, 5, -1]],
      ['terrace', [10, 4.1, -1.5]],
      ['beach', [18, -3.4, -38]],
    ]
    for (const [label, pt] of frame) expect(inFrame(b, pt), `final frame: ${label}`).toBe(true)
  })

  it('opens on a wide establishing view of the facade, porch and pool deck', () => {
    const a = tour.sample(0)
    const frame: Array<[string, V]> = [
      ['wing', [2, 5, 0]],
      ['core', [22, 5, 0]],
      ['pool', [11.5, 0.6, -6.6]],
      ['porch', [22, 0.6, -1]],
    ]
    for (const [label, pt] of frame) expect(inFrame(a, pt), `opening frame: ${label}`).toBe(true)
  })
})
