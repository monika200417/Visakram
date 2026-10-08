import { existsSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { heroFilm, heroFrameAtProgress, heroFramePath, heroPoster } from '../../src/data/heroFilm'
import { heroSceneIndexAtProgress, heroScenes } from '../../src/data/heroScenes'

describe('hero film data', () => {
  it('names frames f_0001… and uses the first frame as the poster', () => {
    expect(heroFramePath(0)).toBe('/assets/hero/frames/f_0001.webp')
    expect(heroFramePath(heroFilm.frameCount - 1)).toBe(
      `/assets/hero/frames/f_00${heroFilm.frameCount}.webp`,
    )
    expect(heroPoster).toBe(heroFramePath(0))
  })

  it('maps scroll progress linearly onto the first-to-last frame, clamped', () => {
    expect(heroFrameAtProgress(0)).toBe(0)
    expect(heroFrameAtProgress(1)).toBe(heroFilm.frameCount - 1)
    expect(heroFrameAtProgress(0.5)).toBeCloseTo((heroFilm.frameCount - 1) / 2)
    expect(heroFrameAtProgress(-1)).toBe(0)
    expect(heroFrameAtProgress(2)).toBe(heroFilm.frameCount - 1)
  })

  it('lengthens the existing hero pin to a short cinematic run, not an excessive one', () => {
    expect(heroFilm.scrollPercent).toBeGreaterThanOrEqual(250)
    expect(heroFilm.scrollPercent).toBeLessThanOrEqual(300)
  })

  it('ships exactly the frames it declares, lightweight, outside the retired Home Tour directory', () => {
    const dir = resolve(__dirname, '../../public/assets/hero/frames')
    const files = readdirSync(dir).filter((name) => name.endsWith('.webp'))
    expect(files).toHaveLength(heroFilm.frameCount)
    let total = 0
    for (let i = 0; i < heroFilm.frameCount; i += 1) {
      const file = resolve(__dirname, '../../public', heroFramePath(i).slice(1))
      expect(existsSync(file), heroFramePath(i)).toBe(true)
      total += statSync(file).size
    }
    expect(total).toBeLessThan(5 * 1024 * 1024)
    expect(total / heroFilm.frameCount).toBeLessThan(70 * 1024)
    expect(heroFilm.basePath).not.toContain('home-tour')
  })
})

describe('hero scenes (caption chapters)', () => {
  it('start at 0 and strictly ascend, so each progress value has exactly one scene', () => {
    expect(heroScenes[0]!.start).toBe(0)
    heroScenes.slice(1).forEach((scene, i) => {
      expect(scene.start).toBeGreaterThan(heroScenes[i]!.start)
      expect(scene.start).toBeLessThan(1)
    })
  })

  it('picks the scene a progress value falls in; a boundary belongs to the scene it begins', () => {
    expect(heroSceneIndexAtProgress(0)).toBe(0)
    expect(heroSceneIndexAtProgress(heroScenes[1]!.start - 0.001)).toBe(0)
    expect(heroSceneIndexAtProgress(heroScenes[1]!.start)).toBe(1)
    expect(heroSceneIndexAtProgress(1)).toBe(heroScenes.length - 1)
  })

  it('keeps the numbered ids and short captions', () => {
    expect(heroScenes.map((scene) => scene.id)).toEqual(['arrival', 'threshold', 'interior'])
    expect(heroScenes.map((scene) => `${scene.chapter} / ${scene.caption}`)).toEqual([
      '01 / Arrival',
      '02 / Threshold',
      '03 / Home',
    ])
  })
})
