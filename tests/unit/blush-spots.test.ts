import { describe, expect, it } from 'vitest'
import { BLUSH_COUNT, applyBlushSpots, blushSpots } from '../../src/components/layout/blushSpots'

/** A repeatable stand-in for Math.random. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

describe('blush spots (the light-orange glows laid over the page)', () => {
  it('draws ten, one in each tenth of the page, so no two are close together', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const spots = blushSpots(seeded(seed))
      expect(spots).toHaveLength(BLUSH_COUNT)
      spots.forEach((spot, i) => {
        expect(spot.y).toBeGreaterThanOrEqual(i * 10)
        expect(spot.y).toBeLessThanOrEqual((i + 1) * 10)
      })
      // always at least 2.4% of the page's height apart (the bands leave a 12% margin each side), in order down the page
      for (let i = 1; i < spots.length; i += 1) {
        expect(spots[i]!.y - spots[i - 1]!.y).toBeGreaterThanOrEqual(2.3)
      }
    }
  })

  it('keeps every glow near one side or the other, inside the page, at a soft size', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      for (const spot of blushSpots(seeded(seed))) {
        const nearLeft = spot.x >= 2 && spot.x <= 30
        const nearRight = spot.x >= 70 && spot.x <= 98
        expect(nearLeft || nearRight).toBe(true)
        expect(spot.size).toBeGreaterThanOrEqual(340)
        expect(spot.size).toBeLessThanOrEqual(640)
      }
    }
  })

  it('is different on different visits, and the same for the same draw', () => {
    expect(blushSpots(seeded(1))).toEqual(blushSpots(seeded(1)))
    expect(blushSpots(seeded(1))).not.toEqual(blushSpots(seeded(2)))
  })

  it('hands the places to the stylesheet as CSS variables', () => {
    const element = document.createElement('main')
    const spots = blushSpots(seeded(7))
    applyBlushSpots(element, spots)
    spots.forEach((spot, i) => {
      expect(element.style.getPropertyValue(`--blush-${i + 1}-x`)).toBe(`${spot.x}%`)
      expect(element.style.getPropertyValue(`--blush-${i + 1}-y`)).toBe(`${spot.y}%`)
      expect(element.style.getPropertyValue(`--blush-${i + 1}-size`)).toBe(`${spot.size}px`)
    })
  })
})
