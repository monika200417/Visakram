import { describe, expect, it } from 'vitest'
import {
  getWayBeatIndex,
  getWayChapterIndex,
  getWayVisual,
  visakramWayPrinciples,
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

  it('walks the three beats within a chapter', () => {
    expect(getWayBeatIndex(0.01, 3)).toBe(0)
    expect(getWayBeatIndex(0.33 + 0.1, 3)).toBe(1)
    expect(getWayBeatIndex(0.33 + 0.28, 3)).toBe(2)
  })

  it('has a three-beat visual for every principle, with no asset by default', () => {
    for (const principle of visakramWayPrinciples) {
      const visual = getWayVisual(principle.title)
      expect(visual.beats).toHaveLength(3)
      expect(visual.asset).toBeUndefined()
    }
  })
})
