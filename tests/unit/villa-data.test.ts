import { describe, expect, it } from 'vitest'
import { homeTourDisclaimer, homeTourHeading, homeTourTagline } from '../../src/data/homeTour'
import { villaChapters } from '../../src/three/home-tour/villa/chapters'
import { villaWaypoints } from '../../src/three/home-tour/villa/tour'

describe('Villa tour data', () => {
  it('has the eight approved chapters in journey order with consistent numbering', () => {
    expect(villaChapters.map((c) => `${c.index} ${c.title}`)).toEqual([
      '01 Exterior',
      '02 Entry',
      '03 Living',
      '04 Dining + Kitchen',
      '05 Staircase',
      '06 Bedroom',
      '07 Ocean Terrace',
      '08 Final Reveal',
    ])
    expect(homeTourHeading).toBe('Home Tour')
    expect(homeTourTagline).toBe('Experience spaces beyond walls.')
  })

  it('anchors every chapter on exactly one camera waypoint, in the same order', () => {
    const anchored = villaWaypoints.filter((w) => w.chapter).map((w) => w.id)
    expect(anchored).toEqual(villaChapters.map((c) => c.id))
  })

  it('has unique waypoint ids and valid chapterFrom references', () => {
    const ids = villaWaypoints.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const w of villaWaypoints) {
      if (w.chapterFrom) {
        expect(ids.indexOf(w.chapterFrom)).toBeGreaterThanOrEqual(0)
        expect(ids.indexOf(w.chapterFrom)).toBeLessThan(ids.indexOf(w.id))
      }
    }
  })

  it('uses only editorial copy — no claim phrases and no brand mark', () => {
    const copy = villaChapters.map((c) => `${c.title} ${c.caption}`).join(' ')
    expect(copy.toLowerCase()).not.toContain('superior construction')
    expect(copy.toLowerCase()).not.toContain('visakram')
    for (const c of villaChapters) expect(c.caption.length).toBeGreaterThan(10)
  })

  it('labels the residence as illustrative, not a specific project', () => {
    expect(homeTourDisclaimer).toMatch(/illustrative/i)
    expect(homeTourDisclaimer).toMatch(/not a specific/i)
  })
})
