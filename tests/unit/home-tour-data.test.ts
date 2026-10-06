import { describe, expect, it } from 'vitest'
import {
  homeTourChapters,
  homeTourDisclaimer,
  homeTourHeading,
  homeTourTagline,
} from '../../src/data/homeTour'
import {
  homeTourMedia,
  homeTourPinPercent,
  homeTourSequence,
  joinChapters,
} from '../../src/media/home-tour/manifest'

describe('Home Tour chapter data', () => {
  it('has the nine chapters in tour order with consistent numbering', () => {
    expect(homeTourChapters.map((c) => `${c.index} ${c.title}`)).toEqual([
      '01 Exterior',
      '02 Entry',
      '03 Living',
      '04 Dining',
      '05 Kitchen',
      '06 Staircase',
      '07 Bedroom',
      '08 Balcony',
      '09 Final Reveal',
    ])
    expect(new Set(homeTourChapters.map((c) => c.id)).size).toBe(homeTourChapters.length)
    expect(homeTourHeading).toBe('Home Tour')
    expect(homeTourTagline).toBe('Experience spaces beyond walls.')
  })

  it('uses only editorial copy — no claim phrases and no brand mark', () => {
    const copy = homeTourChapters.map((c) => `${c.title} ${c.caption}`).join(' ')
    expect(copy.toLowerCase()).not.toContain('superior construction')
    expect(copy.toLowerCase()).not.toContain('visakram')
    for (const c of homeTourChapters) expect(c.caption.length).toBeGreaterThan(10)
  })

  it('labels the residence as illustrative, not a specific project', () => {
    expect(homeTourDisclaimer).toMatch(/illustrative/i)
    expect(homeTourDisclaimer).toMatch(/not a specific/i)
  })
})

describe('Home Tour media manifest', () => {
  it('carries only Phase 1 footage: 01 Exterior and 06 Staircase, in tour order', () => {
    expect(homeTourSequence.map((c) => `${c.index} ${c.title}`)).toEqual([
      '01 Exterior',
      '06 Staircase',
    ])
  })

  it('gives every chapter an id, title, caption, poster, video, start and end — all from data', () => {
    for (const c of homeTourSequence) {
      expect(c.id).toBeTruthy()
      expect(c.title).toBeTruthy()
      expect(c.caption).toBeTruthy()
      expect(c.poster).toMatch(/\.(webp|avif|jpg|png)$/)
      expect(c.video).toMatch(/\.(mp4|webm)$/)
      expect(c.end).toBeGreaterThan(c.start)
      expect(c.start).toBeGreaterThanOrEqual(0)
      expect(c.scrollVh).toBeGreaterThan(0)
    }
  })

  it('takes its order from the editorial chapters, not from the manifest', () => {
    const reversed = [...homeTourMedia].reverse()
    expect(joinChapters(homeTourChapters, reversed).map((c) => c.id)).toEqual(
      homeTourSequence.map((c) => c.id),
    )
  })

  it('fails loudly on a manifest entry with no chapter, or with an impossible range', () => {
    const base = homeTourMedia[0]!
    expect(() => joinChapters(homeTourChapters, [{ ...base, id: 'nowhere' }])).toThrow(
      /no editorial/,
    )
    expect(() => joinChapters(homeTourChapters, [{ ...base, start: 2, end: 1 }])).toThrow(/invalid/)
    expect(() => joinChapters(homeTourChapters, [{ ...base, scrollVh: 0 }])).toThrow(/invalid/)
  })

  it('derives the pin length from the chapters (data, not a constant in the hook)', () => {
    expect(homeTourPinPercent).toBe(homeTourSequence.reduce((sum, c) => sum + c.scrollVh, 0))
    expect(homeTourPinPercent).toBeGreaterThan(0)
  })

  it('keeps unconfirmed reference media flagged and in the placeholder folder that builds strip out', () => {
    for (const entry of homeTourMedia) {
      if (entry.placeholder) {
        expect(entry.video).toContain('/placeholder/')
        expect(entry.poster).toContain('/placeholder/')
      }
    }
    expect(homeTourMedia.some((m) => m.placeholder)).toBe(true)
  })
})
