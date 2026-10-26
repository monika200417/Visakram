import { describe, expect, it } from 'vitest'
import {
  CLIP_EYE,
  FLIGHT_PATH,
  STAGE_W,
  flightCentre,
} from '../../src/sections/home/EagleHero/heroConfig'

describe('eagle flight path (where a narrow screen is centred while the clip plays)', () => {
  it('is listed in clip order and stays on the stage', () => {
    const times = FLIGHT_PATH.map(([t]) => t)
    expect(times).toEqual([...times].sort((a, b) => a - b))
    expect(times[0]).toBe(0)
    for (const [, x] of FLIGHT_PATH) {
      expect(x).toBeGreaterThan(0)
      expect(x).toBeLessThan(STAGE_W)
    }
  })

  it('reads the listed point at each reading and blends linearly between them', () => {
    for (const [t, x] of FLIGHT_PATH) expect(flightCentre(t)).toBeCloseTo(x, 6)
    const [t0, x0] = FLIGHT_PATH[1]!
    const [t1, x1] = FLIGHT_PATH[2]!
    expect(flightCentre((t0 + t1) / 2)).toBeCloseTo((x0 + x1) / 2, 6)
  })

  it('holds the first point before the clip and the last after it', () => {
    expect(flightCentre(-1)).toBe(FLIGHT_PATH[0]![1])
    expect(flightCentre(99)).toBe(FLIGHT_PATH[FLIGHT_PATH.length - 1]![1])
  })

  it('ends near where the eagle perches, so the view does not jump when the clip hands off', () => {
    expect(Math.abs(flightCentre(6) - CLIP_EYE.x)).toBeLessThan(250)
  })
})
