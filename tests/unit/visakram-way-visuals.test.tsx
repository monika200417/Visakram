import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import {
  QualityOverlay,
  QualityPlate,
} from '../../src/sections/home/VisakramWaySection/QualityStudy'
import {
  TimelinessOverlay,
  TimelinessPlate,
} from '../../src/sections/home/VisakramWaySection/TimelinessBuild'
import {
  TransparencyOverlay,
  TransparencyPlate,
} from '../../src/sections/home/VisakramWaySection/TransparencyExploded'
import { WayDefs } from '../../src/sections/home/VisakramWaySection/WayDefs'
import { WayVisual } from '../../src/sections/home/VisakramWaySection/WayVisual'
import { getWayVisual, wayStageStarts } from '../../src/data/visakramWay'

const chapters = [
  ['quality', QualityPlate, QualityOverlay],
  ['timeliness', TimelinessPlate, TimelinessOverlay],
  ['transparency', TransparencyPlate, TransparencyOverlay],
] as const

const revealTimes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-way-reveal]')).map((el) =>
    Number((el as SVGElement).dataset.wayAt),
  )

describe('Visakram Way SVG visuals', () => {
  it.each(chapters)('%s reveals artwork within each of its stages', (motif, Plate, Overlay) => {
    const { container } = render(
      <>
        <Plate />
        <Overlay />
      </>,
    )
    const ats = revealTimes(container)
    const starts = wayStageStarts[motif]
    starts.forEach((start, i) => {
      const end = starts[i + 1] ?? 1
      expect(ats.some((at) => at >= start && at < end)).toBe(true)
    })
  })

  it.each(chapters)(
    '%s keeps reveals inside the chapter and the SVG lean (no filters)',
    (_, Plate, Overlay) => {
      const { container } = render(
        <>
          <Plate />
          <Overlay />
        </>,
      )
      for (const at of revealTimes(container)) {
        expect(at).toBeGreaterThanOrEqual(0)
        expect(at).toBeLessThan(1)
      }
      expect(container.querySelectorAll('*').length).toBeLessThan(1100)
      expect(container.querySelector('filter')).toBeNull()
    },
  )

  it('references only paint defs that WayDefs provides', () => {
    const defs = render(<WayDefs />).container
    const ids = new Set(Array.from(defs.querySelectorAll('[id]')).map((el) => el.id))
    for (const [, Plate, Overlay] of chapters) {
      const { container } = render(
        <>
          <Plate />
          <Overlay />
        </>,
      )
      const refs = Array.from(container.querySelectorAll('[style*="url(#"]')).flatMap((el) =>
        Array.from((el.getAttribute('style') ?? '').matchAll(/url\(#([\w-]+)\)/g)).map((m) => m[1]),
      )
      for (const ref of refs) expect(ids.has(ref as string)).toBe(true)
    }
  })

  it('renders a plate plus an overlay and no stage captions of its own', () => {
    const visual = getWayVisual('Timeliness')
    const { container } = render(<WayVisual visual={visual} />)
    expect(container.querySelectorAll('[data-way-media] svg')).toHaveLength(2)
    // Stage captions live in one section-level row, never inside a chapter layer.
    expect(container.querySelectorAll('[data-way-beat-label]')).toHaveLength(0)
  })

  it('swaps only the rendered plate for real client media; the gold overlay stays', () => {
    const visual = {
      ...getWayVisual('Quality'),
      asset: { kind: 'image', src: '/x.jpg', alt: 'x' },
    } as const
    const { container } = render(<WayVisual visual={visual} />)
    expect(container.querySelector('[data-way-media] img')).not.toBeNull()
    expect(container.querySelectorAll('[data-way-media] svg')).toHaveLength(1)
  })
})
