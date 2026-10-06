import { describe, expect, it } from 'vitest'
import { render, within } from '@testing-library/react'
import { VisakramWaySection } from '../../src/sections/home/VisakramWaySection/VisakramWaySection'
import { getWayVisual, visakramWayPrinciples } from '../../src/data/visakramWay'

describe('Visakram Way section structure', () => {
  it('renders exactly one stage row per chapter, outside the chapter layers', () => {
    const { container } = render(<VisakramWaySection />)
    const rows = container.querySelectorAll('[data-way-stage-row]')
    expect(rows).toHaveLength(visakramWayPrinciples.length)
    rows.forEach((row, i) => {
      const labels = Array.from(row.querySelectorAll('[data-way-beat-label]')).map((li) =>
        li.textContent?.replace(/^\d+/, ''),
      )
      expect(labels).toEqual(
        getWayVisual(visakramWayPrinciples[i]!.title).stages.map((s) => s.label),
      )
      // Only the opening chapter's row starts active; the hook toggles the rest.
      expect(row.getAttribute('data-active')).toBe(String(i === 0))
    })
    // No chapter layer carries stage captions that could show through a crossfade.
    container.querySelectorAll('[data-way-layer]').forEach((layer) => {
      expect(layer.querySelector('[data-way-beat-label]')).toBeNull()
    })
  })

  it('keeps all three principles as real headings with their copy (fallback + a11y)', () => {
    const { container } = render(<VisakramWaySection />)
    const scoped = within(container)
    expect(scoped.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      visakramWayPrinciples.map((p) => p.title),
    )
    for (const p of visakramWayPrinciples)
      expect(scoped.getByText(p.description)).toBeInTheDocument()
    // Three chapter layers, in order Quality → Timeliness → Transparency.
    expect(container.querySelectorAll('[data-way-layer]')).toHaveLength(3)
  })

  it('marks the decorative visual and stage rows as hidden from assistive tech', () => {
    const { container } = render(<VisakramWaySection />)
    expect(
      container.querySelector('[data-way-stage-row]')?.closest('[aria-hidden="true"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-way-layer]')?.closest('[aria-hidden="true"]'),
    ).not.toBeNull()
  })
})
