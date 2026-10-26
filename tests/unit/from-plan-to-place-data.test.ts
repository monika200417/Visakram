import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  fromPlanToPlaceStageEnds,
  fromPlanToPlaceStages,
  fromPlanToPlaceVideo,
  getActiveStageIndex,
} from '../../src/data/fromPlanToPlace'

describe('from plan to place — stage emphasis', () => {
  it('splits the scroll into six equal parts, one per stage, in order', () => {
    expect(fromPlanToPlaceStageEnds).toHaveLength(fromPlanToPlaceStages.length)
    expect(getActiveStageIndex(0)).toBe(0)
    expect(getActiveStageIndex(0.16)).toBe(0)
    expect(getActiveStageIndex(0.17)).toBe(1)
    expect(getActiveStageIndex(0.5)).toBe(3)
    expect(getActiveStageIndex(0.99)).toBe(5)
    expect(getActiveStageIndex(1)).toBe(5)
  })
})

describe('from plan to place — video asset', () => {
  const file = (url: string) => resolve(__dirname, '../../public', url.slice(1))

  it('ships the supplied video and its poster as plain files under /assets/videos', () => {
    expect(fromPlanToPlaceVideo.src).toBe('/assets/videos/plan-to-place.mp4')
    expect(existsSync(file(fromPlanToPlaceVideo.src))).toBe(true)
    expect(existsSync(file(fromPlanToPlaceVideo.poster))).toBe(true)
  })

  it('keeps the poster light, since it is the only part fetched before the chapter is near', () => {
    expect(statSync(file(fromPlanToPlaceVideo.poster)).size).toBeLessThan(150 * 1024)
  })
})
