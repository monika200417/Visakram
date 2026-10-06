import { describe, expect, it } from 'vitest'
import { doorOpen, glassOpen } from '../../src/three/home-tour/villa/choreography'
import { villaTour as tour } from '../../src/three/home-tour/villa/tour'

const STEPS = 4000
const at = (id: string) => tour.arrivalProgress[id]!

describe('Villa choreography', () => {
  it('opens the front door only as the camera climbs to the porch, and never closes it again', () => {
    expect(doorOpen(0)).toBe(0)
    expect(doorOpen(at('approachB'))).toBe(0)
    // fully open well before the camera crosses the threshold
    expect(doorOpen(at('entry'))).toBeCloseTo(1, 5)
    expect(doorOpen(at('threshold'))).toBe(1)
    expect(doorOpen(1)).toBe(1)
    let last = 0
    for (let i = 0; i <= STEPS; i++) {
      const v = doorOpen(i / STEPS)
      expect(v).toBeGreaterThanOrEqual(last - 1e-9)
      expect(v).toBeLessThanOrEqual(1)
      last = v
    }
  })

  it('slides the suite glass open between the bedroom turn and the terrace, fully open before the camera reaches it', () => {
    expect(glassOpen(at('bedroom'))).toBe(0)
    expect(glassOpen(at('bedTurnA'))).toBe(0)
    expect(glassOpen(at('sliderApproach'))).toBeCloseTo(1, 5)
    expect(glassOpen(at('terrace'))).toBe(1)
    expect(glassOpen(1)).toBe(1)
  })
})
