import { describe, expect, it } from 'vitest'
import {
  chapterIndexAtProgress,
  chapterIndexAtTime,
  chapterProgressRange,
  filmProgressAtTime,
  filmTimeAtProgress,
  homeTourFilm,
  homeTourFilmChapters,
  homeTourFilmScrollPercent,
} from '../../src/data/homeTourFilm'

describe('home tour film data', () => {
  it('describes the real video: 1920×1080, about 25.87 s, served from public/assets/videos', () => {
    expect(homeTourFilm.width).toBe(1920)
    expect(homeTourFilm.height).toBe(1080)
    expect(homeTourFilm.duration).toBeCloseTo(25.87, 2)
    expect(homeTourFilm.src).toBe('/assets/videos/home-tour.mp4')
    expect(homeTourFilm.poster).toBe('/assets/videos/home-tour-poster.webp')
  })

  it('has exactly the eight chapters of the film, in order, with the supplied boundaries', () => {
    expect(homeTourFilmChapters.map((c) => [c.index, c.title, c.start])).toEqual([
      ['01', 'Living', 0],
      ['02', 'Kitchen', 3.8],
      ['03', 'Staircase', 7.3],
      ['04', 'Hallway', 13.5],
      ['05', 'Bedroom', 16.5],
      ['06', 'Balcony', 18.0],
      ['07', 'Ocean View', 19.5],
      ['08', 'Final Reveal', 22.4],
    ])
  })

  it('starts at 0:00, increases strictly, and ends inside the video', () => {
    const starts = homeTourFilmChapters.map((c) => c.start)
    expect(starts[0]).toBe(0)
    for (let i = 1; i < starts.length; i += 1) expect(starts[i]!).toBeGreaterThan(starts[i - 1]!)
    expect(starts[starts.length - 1]!).toBeLessThan(homeTourFilm.duration)
    expect(new Set(homeTourFilmChapters.map((c) => c.id)).size).toBe(homeTourFilmChapters.length)
  })
})

describe('home tour film timing', () => {
  it('maps scroll progress to video time linearly: 0 → 0:00 and 1 → the full duration', () => {
    expect(filmTimeAtProgress(0)).toBe(0)
    expect(filmTimeAtProgress(1)).toBeCloseTo(homeTourFilm.duration, 6)
    expect(filmTimeAtProgress(0.5)).toBeCloseTo(homeTourFilm.duration / 2, 6)
    // clamped: scrolling past either end never asks for a time outside the video
    expect(filmTimeAtProgress(-1)).toBe(0)
    expect(filmTimeAtProgress(2)).toBeCloseTo(homeTourFilm.duration, 6)
  })

  it('round-trips time and progress', () => {
    for (const t of [0, 3.8, 10, 19.5, 25.87]) {
      expect(filmTimeAtProgress(filmProgressAtTime(t))).toBeCloseTo(t, 6)
    }
  })

  it('switches chapter exactly at each boundary, and a boundary belongs to the chapter it begins', () => {
    homeTourFilmChapters.forEach((chapter, i) => {
      expect(chapterIndexAtTime(chapter.start), chapter.title).toBe(i)
      if (i > 0)
        expect(chapterIndexAtTime(chapter.start - 0.01), `${chapter.title} - 0.01`).toBe(i - 1)
    })
    expect(chapterIndexAtTime(homeTourFilm.duration)).toBe(homeTourFilmChapters.length - 1)
  })

  it('places every chapter in the scroll ranges the film was planned around', () => {
    const percent = (name: string) => {
      const i = homeTourFilmChapters.findIndex((c) => c.title === name)
      const { from, to } = chapterProgressRange(i)
      return [from * 100, to * 100]
    }
    const within = ([from, to]: number[], [lo, hi]: number[]) => {
      expect(from!).toBeGreaterThanOrEqual(lo! - 1)
      expect(from!).toBeLessThanOrEqual(lo! + 1)
      expect(to!).toBeGreaterThanOrEqual(hi! - 1)
      expect(to!).toBeLessThanOrEqual(hi! + 1)
    }
    within(percent('Living'), [0, 15])
    within(percent('Kitchen'), [15, 28])
    within(percent('Staircase'), [28, 52])
    within(percent('Hallway'), [52, 64])
    within(percent('Bedroom'), [64, 70])
    within(percent('Balcony'), [70, 75])
    within(percent('Ocean View'), [75, 87])
    within(percent('Final Reveal'), [87, 100])
  })

  it('covers the whole progress range with no gap or overlap between chapters', () => {
    expect(chapterProgressRange(0).from).toBe(0)
    for (let i = 0; i < homeTourFilmChapters.length - 1; i += 1) {
      expect(chapterProgressRange(i).to).toBeCloseTo(chapterProgressRange(i + 1).from, 9)
    }
    expect(chapterProgressRange(homeTourFilmChapters.length - 1).to).toBe(1)
  })

  it('reports the active chapter by progress, and the same chapters back again in reverse', () => {
    const progresses = [0, 0.2, 0.4, 0.6, 0.67, 0.73, 0.8, 0.95]
    const forward = progresses.map(chapterIndexAtProgress)
    expect(forward).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    // scrolling back retraces the same chapters: it is a pure function of progress
    expect([...progresses].reverse().map(chapterIndexAtProgress)).toEqual([...forward].reverse())
  })

  it('gives the film enough scroll: about ten viewport heights, shortest chapter still comfortable', () => {
    expect(homeTourFilmScrollPercent).toBeGreaterThan(900)
    expect(homeTourFilmScrollPercent).toBeLessThan(1500)
    const shortest = Math.min(
      ...homeTourFilmChapters.map((_, i) => {
        const { from, to } = chapterProgressRange(i)
        return (to - from) * homeTourFilmScrollPercent
      }),
    )
    // percent of one viewport height of scroll for the shortest chapter (Balcony)
    expect(shortest).toBeGreaterThan(30)
  })
})
