import { describe, expect, it } from 'vitest'
import {
  getWayChapterIndex,
  getWayStageIndex,
  getWayVisual,
  visakramWayPrinciples,
  wayStageStarts,
} from '../../src/data/visakramWay'

describe('Visakram Way story progress', () => {
  it('maps normalized progress to Quality / Timeliness / Transparency thirds', () => {
    expect(getWayChapterIndex(0, 3)).toBe(0)
    expect(getWayChapterIndex(0.32, 3)).toBe(0)
    expect(getWayChapterIndex(0.34, 3)).toBe(1)
    expect(getWayChapterIndex(0.66, 3)).toBe(1)
    expect(getWayChapterIndex(0.67, 3)).toBe(2)
    expect(getWayChapterIndex(1, 3)).toBe(2)
  })

  it('has the approved stage labels per chapter, in order', () => {
    const labels = (title: string) => getWayVisual(title).stages.map((s) => s.label)
    expect(labels('Quality')).toEqual([
      'Material',
      'Structural precision',
      'Craftsmanship',
      'Finish',
    ])
    expect(labels('Timeliness')).toEqual([
      'Foundation',
      'Structure',
      'Floors',
      'Envelope',
      'Completion',
    ])
    expect(labels('Transparency')).toEqual([
      'Plan',
      'Structure',
      'Walls & envelope',
      'Materials & facade',
      'Finished space',
    ])
  })

  it('keeps every chapter’s stage starts increasing, within 0–1, beginning at 0', () => {
    for (const starts of Object.values(wayStageStarts)) {
      expect(starts[0]).toBe(0)
      for (let i = 1; i < starts.length; i++) {
        expect(starts[i]).toBeGreaterThan(starts[i - 1] ?? 0)
        expect(starts[i]).toBeLessThan(1)
      }
    }
  })

  it('walks Quality’s four stages across its third of the progress', () => {
    const stages = getWayVisual('Quality').stages
    // Quality spans progress 0–1/3; local = progress * 3.
    expect(getWayStageIndex(0.01, 3, stages)).toBe(0)
    expect(getWayStageIndex(0.25 / 3, 3, stages)).toBe(1)
    expect(getWayStageIndex(0.5 / 3, 3, stages)).toBe(2)
    expect(getWayStageIndex(0.8 / 3, 3, stages)).toBe(3)
  })

  it('walks Timeliness’s and Transparency’s five stages', () => {
    const t = getWayVisual('Timeliness').stages
    expect(getWayStageIndex(1 / 3 + 0.1 / 3, 3, t)).toBe(0)
    expect(getWayStageIndex(1 / 3 + 0.45 / 3, 3, t)).toBe(2)
    expect(getWayStageIndex(1 / 3 + 0.85 / 3, 3, t)).toBe(4)
    const tr = getWayVisual('Transparency').stages
    expect(getWayStageIndex(2 / 3 + 0.65 / 3, 3, tr)).toBe(3)
    expect(getWayStageIndex(1, 3, tr)).toBe(4)
  })

  it('has no asset by default for any principle', () => {
    for (const principle of visakramWayPrinciples) {
      expect(getWayVisual(principle.title).asset).toBeUndefined()
    }
  })
})
