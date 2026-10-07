import { Profiler } from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomeTourMedia } from '../../src/sections/home/HomeTourSection/HomeTourMedia'
import type { HomeTourSceneChapter } from '../../src/media/home-tour/manifest'
import { buildTimeline } from '../../src/media/home-tour/timeline'

const chapters: HomeTourSceneChapter[] = ['a', 'b', 'c', 'd'].map((id, i) => ({
  id,
  index: `0${i + 1}`,
  title: `Chapter ${id}`,
  caption: `Caption for chapter ${id}.`,
  still: `/test/${id}.webp`,
  mobile: `/test/${id}.webp`,
  fit: 'cover',
  video: `/test/${id}.mp4`,
  start: 2 * i,
  end: 2 * i + 4,
  scrollVh: 100,
  reference: null,
  source: null,
  status: 'production',
  brief: 'Test chapter.',
}))
const timeline = buildTimeline(chapters, 0.06)
const listTimeline = (list: HomeTourSceneChapter[]) =>
  list === chapters ? timeline : buildTimeline(list, 0.06)

function setup(initial = 0, list: HomeTourSceneChapter[] = chapters) {
  const progressRef = { current: { value: initial } }
  let driver: ((p: number) => void) | null = null
  const onReady = vi.fn((fn: ((p: number) => void) | null) => {
    driver = fn
  })
  const commits = { count: 0 }
  const view = render(
    <Profiler id="media" onRender={() => commits.count++}>
      <HomeTourMedia
        chapters={list}
        timeline={listTimeline(list)}
        progressRef={progressRef}
        onReady={onReady}
      />
    </Profiler>,
  )
  const root = () => view.container.querySelector('[data-home-tour-media]') as HTMLElement
  const figure = (id: string) =>
    root().querySelector(`[data-chapter="${id}"]`) as HTMLElement | null
  const scrub = (p: number) => act(() => driver!(p))
  return { ...view, root, figure, scrub, onReady, commits, driver: () => driver }
}

describe('HomeTourMedia', () => {
  it('shows a still and a muted, inline, control-free clip for the current and next chapter only', () => {
    const { root, figure } = setup()
    expect(
      Array.from(root().querySelectorAll('[data-chapter]')).map((f) =>
        f.getAttribute('data-chapter'),
      ),
    ).toEqual(['a', 'b'])
    const video = figure('a')!.querySelector('video')!
    expect(video.muted).toBe(true)
    expect(video.hasAttribute('playsinline')).toBe(true)
    expect(video.hasAttribute('controls')).toBe(false)
    expect(video.hasAttribute('autoplay')).toBe(false)
    expect(video.getAttribute('preload')).toBe('auto')
    expect(figure('b')!.querySelector('video')!.getAttribute('preload')).toBe('auto')
    expect(figure('a')!.querySelector('img')!.getAttribute('src')).toBe('/test/a.webp')
    expect(root().getAttribute('aria-hidden')).toBe('true')
  })

  it('registers its frame driver with the scroll hook and releases it on unmount', () => {
    const { onReady, unmount, driver } = setup()
    expect(onReady).toHaveBeenCalledWith(expect.any(Function))
    expect(driver()).toBeTypeOf('function')
    unmount()
    expect(onReady).toHaveBeenLastCalledWith(null)
  })

  it('draws the first frame at once: first chapter visible, the next hidden', () => {
    const { figure, root } = setup()
    expect(figure('a')!.style.opacity).toBe('1')
    expect(figure('a')!.style.visibility).toBe('visible')
    expect(figure('b')!.style.opacity).toBe('0')
    expect(figure('b')!.style.visibility).toBe('hidden')
    expect(root().dataset.active).toBe('a')
  })

  it('starts where the shared progress already is (no flash of the wrong chapter)', () => {
    const { figure, root } = setup(0.6)
    expect(root().dataset.active).toBe('c')
    expect(figure('c')!.style.opacity).toBe('1')
  })

  it('follows scroll with no React state updates while a chapter plays', () => {
    const { scrub, commits, root } = setup()
    const before = commits.count
    for (let i = 1; i <= 40; i++) scrub((i / 40) * 0.2)
    expect(commits.count).toBe(before)
    expect(Number(root().dataset.clipTime)).toBeGreaterThan(0)
  })

  it('moves the load window only at chapter changes, releasing distant clips', () => {
    const { scrub, figure } = setup()
    scrub(0.6)
    expect(figure('a')).toBeNull() // two chapters behind: released
    expect(figure('b')).not.toBeNull() // previous: kept for instant reverse
    expect(figure('c')).not.toBeNull()
    expect(figure('d')).not.toBeNull() // next: preloading
    scrub(0.1) // back to the start
    expect(figure('a')).not.toBeNull()
    expect(figure('d')).toBeNull()
  })

  it('crossfades between chapters over a handoff and reverses exactly', () => {
    const { scrub, figure } = setup()
    scrub(0.25) // the middle of the a → b handoff
    expect(figure('a')!.style.opacity).toBe('1')
    expect(Number(figure('b')!.style.opacity)).toBeCloseTo(0.5, 5)
    const forward = [figure('a')!.style.opacity, figure('b')!.style.opacity]
    scrub(0.9)
    scrub(0.25)
    expect([figure('a')?.style.opacity, figure('b')?.style.opacity]).toEqual(forward)
  })

  it('sets the clip time as the clip becomes seekable, and follows scroll forward and back', () => {
    const { scrub, figure } = setup()
    const video = figure('a')!.querySelector('video')!
    let time = 0
    Object.defineProperty(video, 'currentTime', {
      configurable: true,
      get: () => time,
      set: (v: number) => {
        time = v
      },
    })
    Object.defineProperty(video, 'readyState', { configurable: true, value: 4 })
    act(() => {
      video.dispatchEvent(new Event('loadedmetadata'))
    })
    expect(time).toBe(0) // chapter a starts at 0

    // chapter a plays 0 → 0.22 over clip time 0 → 4; p = 0.11 is halfway
    act(() => {
      video.dispatchEvent(new Event('seeked'))
    })
    scrub(0.11)
    expect(time).toBeCloseTo(2, 5)
    act(() => {
      video.dispatchEvent(new Event('seeked'))
    })
    scrub(0.055)
    expect(time).toBeCloseTo(1, 5)
  })

  it('falls back to the still when a clip fails (never blank)', () => {
    const { figure, scrub } = setup()
    const video = figure('a')!.querySelector('video')!
    act(() => {
      fireEvent.error(video)
    })
    expect(figure('a')!.querySelector('video')).toBeNull()
    expect(figure('a')!.querySelector('img')).not.toBeNull()
    expect(figure('a')!.style.opacity).toBe('1')
    scrub(0.1)
    expect(figure('a')!.querySelector('video')).toBeNull() // stays failed
  })

  it('falls back to a quiet panel when the still fails as well', () => {
    const { figure } = setup()
    act(() => {
      fireEvent.error(figure('a')!.querySelector('img')!)
    })
    expect(figure('a')!.querySelector('img')).toBeNull()
    expect(figure('a')!.querySelector('[data-fallback]')).not.toBeNull()
    expect(figure('a')!.style.visibility).toBe('visible')
  })

  it('shows only the still for a chapter whose clip has not been supplied (no video element at all)', () => {
    const list = chapters.map((c, i) =>
      i === 0 ? { ...c, video: null, status: 'reference-only' as const } : c,
    )
    const { figure, scrub } = setup(0, list)
    expect(figure('a')!.querySelector('video')).toBeNull()
    expect(figure('a')!.querySelector('img')!.getAttribute('src')).toBe('/test/a.webp')
    expect(figure('a')!.dataset.mediaStatus).toBe('reference-only')
    scrub(0.1) // scrolling through a still-only chapter is harmless
    expect(figure('a')!.style.opacity).toBe('1')
  })

  it('shows a quiet panel, never a blank stage or a borrowed image, when a chapter has no media at all', () => {
    const list = chapters.map((c, i) =>
      i === 1 ? { ...c, video: null, still: null, mobile: null, status: 'missing' as const } : c,
    )
    const { figure, scrub } = setup(0, list)
    scrub(0.4) // inside chapter b
    expect(figure('b')!.querySelector('img')).toBeNull()
    expect(figure('b')!.querySelector('video')).toBeNull()
    expect(figure('b')!.querySelector('[data-fallback]')).not.toBeNull()
    expect(figure('b')!.style.visibility).toBe('visible')
    expect(figure('b')!.dataset.mediaStatus).toBe('missing')
  })

  it('hands off cleanly between two still-only chapters in both directions', () => {
    const stills = chapters.map((c) => ({ ...c, video: null, status: 'reference-only' as const }))
    const { figure, scrub } = setup(0, stills)
    scrub(0.25)
    const forward = Number(figure('b')!.style.opacity)
    expect(forward).toBeCloseTo(0.5, 5)
    scrub(0.4)
    scrub(0.25)
    expect(Number(figure('b')!.style.opacity)).toBeCloseTo(forward, 10)
  })
})
