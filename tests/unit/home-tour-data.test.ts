import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
  resolveStill,
} from '../../src/media/home-tour/manifest'
import { homeTourRanges, homeTourTimeline } from '../../src/media/home-tour/timeline'

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

describe('Home Tour media manifest — all nine chapters', () => {
  it('puts every chapter in the timeline, in tour order, each with its own entry', () => {
    expect(homeTourSequence.map((c) => c.id)).toEqual(homeTourChapters.map((c) => c.id))
    expect(homeTourMedia).toHaveLength(9)
    expect(homeTourTimeline.count).toBe(9)
  })

  it('takes its order from the editorial chapters, not from the manifest', () => {
    const reversed = [...homeTourMedia].reverse()
    expect(joinChapters(homeTourChapters, reversed).map((c) => c.id)).toEqual(
      homeTourChapters.map((c) => c.id),
    )
  })

  it('maps each supplied reference image to its chapter by real filename', () => {
    const mapping = Object.fromEntries(homeTourMedia.map((m) => [m.id, m.source]))
    expect(mapping).toEqual({
      exterior: 'master-exterior.png',
      entry: 'master-entry.png',
      living: 'living-room.png',
      dining: 'dining-room.png',
      kitchen: 'kitchen.jpeg',
      staircase: 'master-staircase.png',
      bedroom: 'master-bedroom.png',
      balcony: 'master-balcony.png',
      reveal: 'final-reveal.png',
    })
  })

  it('points every mapped source at a file that really exists, and every reference still at a copy of it', () => {
    for (const entry of homeTourMedia) {
      if (!entry.source) continue
      expect(existsSync(resolve('docs/reference/home-tour', entry.source)), entry.source).toBe(true)
      expect(entry.reference, entry.id).toMatch(/^\/assets\/home-tour\/placeholder\/.+\.webp$/)
      const file = resolve('public', entry.reference!.replace(/^\//, ''))
      expect(existsSync(file), file).toBe(true)
    }
  })

  it('gives every chapter a mapped reference file, none of them production media', () => {
    for (const entry of homeTourMedia) {
      expect(entry.source, entry.id).toBeTruthy()
      expect(entry.reference, entry.id).toBeTruthy()
    }
    expect(homeTourMedia.filter((m) => m.status === 'production')).toHaveLength(0)
    expect(homeTourMedia.filter((m) => m.status === 'missing')).toHaveLength(0)
    expect(homeTourMedia.filter((m) => m.status === 'reference-only')).toHaveLength(9)
    for (const m of homeTourMedia) {
      expect(m.video, `${m.id} must not use the placeholder reel`).toBeNull()
      expect(m.poster, m.id).toBeNull()
      expect(m.brief.length, m.id).toBeGreaterThan(40)
    }
  })

  it('INTENTIONAL EXCEPTION: Exterior and Final Reveal share one byte-identical source image, and no other chapters do', () => {
    const digest = (file: string) =>
      createHash('sha256')
        .update(readFileSync(resolve('docs/reference/home-tour', file)))
        .digest('hex')
    const byHash = new Map<string, string[]>()
    for (const m of homeTourMedia) {
      const hash = digest(m.source!)
      byHash.set(hash, [...(byHash.get(hash) ?? []), m.id])
    }
    const shared = [...byHash.values()].filter((ids) => ids.length > 1)
    // the opening and the closing deliberately use the same exterior composition…
    expect(shared).toEqual([['exterior', 'reveal']])
    expect(digest('final-reveal.png')).toBe(digest('master-exterior.png'))
    // …but they are two distinct source files, each with its own web copy
    const exterior = homeTourMedia.find((m) => m.id === 'exterior')!
    const reveal = homeTourMedia.find((m) => m.id === 'reveal')!
    expect(reveal.source).not.toBe(exterior.source)
    expect(reveal.reference).not.toBe(exterior.reference)
    expect(reveal.brief).toMatch(/INTENTIONALLY/)
  })

  it('keeps Exterior and Final Reveal as two separate chapters, however alike their stills', () => {
    const [exterior, reveal] = [
      homeTourSequence.find((c) => c.id === 'exterior')!,
      homeTourSequence.find((c) => c.id === 'reveal')!,
    ]
    expect(exterior.id).not.toBe(reveal.id)
    expect(exterior.title).not.toBe(reveal.title)
    expect(exterior.caption).not.toBe(reveal.caption)
    expect(exterior.index).toBe('01')
    expect(reveal.index).toBe('09')
    const i = homeTourSequence.indexOf(exterior)
    const j = homeTourSequence.indexOf(reveal)
    expect(homeTourRanges[j]!.from).toBeGreaterThan(homeTourRanges[i]!.to)
    expect(homeTourRanges[i]!.from).toBe(0)
    expect(homeTourRanges[j]!.to).toBe(1)
    expect(reveal.still).toContain('final-reveal.webp')
    expect(exterior.still).toContain('exterior.webp')
  })

  it('fits every still with the cinematic cover treatment: all current references are 16:9 except the 3:2 kitchen photo', () => {
    const fit = Object.fromEntries(homeTourSequence.map((c) => [c.id, c.fit]))
    for (const id of homeTourSequence.map((c) => c.id)) expect(fit[id], id).toBe('cover')
  })

  it('maps Living and Dining to the NEW references and leaves no stale copy behind', () => {
    const dir = resolve('docs/reference/home-tour')
    const living = homeTourMedia.find((m) => m.id === 'living')!
    const dining = homeTourMedia.find((m) => m.id === 'dining')!
    expect(living.source).toBe('living-room.png')
    expect(dining.source).toBe('dining-room.png')
    expect(living.reference).toBe('/assets/home-tour/placeholder/living.webp')
    expect(dining.reference).toBe('/assets/home-tour/placeholder/dining.webp')
    // the replaced files (with spaces in their names) are not referenced anywhere in the manifest…
    for (const stale of ['living room.jpg', 'dining room.jpg']) {
      expect(
        homeTourMedia.some((m) => m.source === stale),
        stale,
      ).toBe(false)
      expect(existsSync(resolve(dir, stale)), `${stale} should be gone`).toBe(false)
    }
    // …and the development copies are exactly one web file per chapter, nothing stale beside them
    const copies = readdirSync(resolve('public/assets/home-tour/placeholder'))
      .filter((f) => f.endsWith('.webp'))
      .sort()
    expect(copies).toEqual(homeTourMedia.map((m) => m.reference!.split('/').pop()!).sort())
  })

  it('keeps every development copy at the same dimensions as its source image (no stale resized copy)', () => {
    const pngSize = (file: string) => {
      const b = readFileSync(file)
      return [b.readUInt32BE(16), b.readUInt32BE(20)]
    }
    const webpSize = (file: string) => {
      const b = readFileSync(file)
      const kind = b.toString('ascii', 12, 16)
      if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
      if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
      throw new Error(`Unsupported WebP chunk ${kind} in ${file}`)
    }
    for (const m of homeTourMedia) {
      if (!m.source!.endsWith('.png')) continue
      const source = resolve('docs/reference/home-tour', m.source!)
      const copy = resolve('public', m.reference!.replace(/^\//, ''))
      expect(webpSize(copy), `${m.id}: ${m.reference} vs ${m.source}`).toEqual(pngSize(source))
    }
  })

  it('gives every chapter the data the experience needs: still, mobile fallback and weight', () => {
    for (const c of homeTourSequence) {
      expect(c.title).toBeTruthy()
      expect(c.caption).toBeTruthy()
      expect(c.scrollVh).toBeGreaterThan(0)
      expect(c.mobile).toBe(c.still) // no separate mobile art yet: the same still
    }
  })

  it('never lets a reference still reach production: with references disallowed, no chapter has a still', () => {
    for (const entry of homeTourMedia) {
      expect(resolveStill(entry, false), entry.id).toBeNull()
    }
    const production = joinChapters(homeTourChapters, homeTourMedia, false)
    expect(production.every((c) => c.still === null && c.mobile === null)).toBe(true)
    // a cleared production poster is used whether or not references are allowed
    expect(resolveStill({ poster: '/p.webp', reference: '/r.webp' }, false)).toBe('/p.webp')
    expect(resolveStill({ poster: null, reference: '/r.webp' }, true)).toBe('/r.webp')
  })

  it('gives the key chapters more scroll than the transitional ones', () => {
    const vh = Object.fromEntries(homeTourMedia.map((m) => [m.id, m.scrollVh]))
    for (const major of ['exterior', 'living', 'staircase', 'balcony', 'reveal']) {
      for (const minor of ['entry', 'dining', 'kitchen', 'bedroom']) {
        expect(vh[major]!, `${major} vs ${minor}`).toBeGreaterThan(vh[minor]!)
      }
    }
    // not identical weights, and the journey stays comfortable (under 15 viewport heights)
    expect(new Set(Object.values(vh)).size).toBeGreaterThan(1)
    expect(homeTourPinPercent).toBeLessThan(1500)
  })

  it("derives each chapter's normalized range from its weight: contiguous, covering 0 → 1", () => {
    expect(homeTourRanges[0]!.from).toBe(0)
    expect(homeTourRanges[8]!.to).toBe(1)
    homeTourRanges.forEach((r, i) => {
      expect(r.to).toBeGreaterThan(r.from)
      if (i > 0) expect(r.from).toBeCloseTo(homeTourRanges[i - 1]!.to, 10)
    })
    const exterior = homeTourRanges[0]!
    const entry = homeTourRanges[1]!
    expect(exterior.to - exterior.from).toBeGreaterThan(entry.to - entry.from)
  })

  it('fails loudly on a manifest entry with no chapter, a chapter with no entry, or a bad range', () => {
    const base = homeTourMedia[0]!
    expect(() => joinChapters(homeTourChapters, [{ ...base, id: 'nowhere' }])).toThrow(
      /no editorial/,
    )
    expect(() => joinChapters(homeTourChapters, [base])).toThrow(/no media entry/)
    expect(() => joinChapters(homeTourChapters, [{ ...base, scrollVh: 0 }])).toThrow(/invalid/)
    expect(() =>
      joinChapters(
        homeTourChapters,
        homeTourMedia.map((m) => ({ ...m, video: '/x.mp4', start: 2, end: 1 })),
      ),
    ).toThrow(/invalid/)
  })

  it('derives the pin length from the chapters (data, not a constant in the hook)', () => {
    expect(homeTourPinPercent).toBe(homeTourSequence.reduce((sum, c) => sum + c.scrollVh, 0))
  })

  it('keeps every reference still under the placeholder folder that builds strip out', () => {
    for (const entry of homeTourMedia) {
      if (entry.reference) expect(entry.reference).toContain('/placeholder/')
    }
  })
})
