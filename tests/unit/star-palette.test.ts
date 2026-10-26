import { describe, expect, it } from 'vitest'
import { GOLD, ORANGE, starPaletteFor } from '../../src/components/cursor/starPalette'

function el(html: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)
  return host.firstElementChild as HTMLElement
}

describe('cursor star palette', () => {
  it('is Visakram orange only over the cream ground', () => {
    expect(starPaletteFor(null)).toBe(ORANGE)
    expect(starPaletteFor(el('<p style="background-color: rgb(244, 236, 220)">text</p>'))).toBe(
      ORANGE,
    )
    // an element with no background of its own takes the ground behind it
    const inner = el('<section style="background-color: #f4ecdc"><p>text</p></section>')
    expect(starPaletteFor(inner.querySelector('p'))).toBe(ORANGE)
    for (const color of ORANGE.colors) expect(color).toBe('#C4441F')
  })

  it('is gold over a dark ground, photographs, video and canvas', () => {
    expect(starPaletteFor(el('<div style="background-color: rgb(46, 43, 40)">x</div>'))).toBe(GOLD)
    expect(starPaletteFor(el('<img alt="" src="/x.jpg" />'))).toBe(GOLD)
    expect(starPaletteFor(el('<video></video>'))).toBe(GOLD)
    expect(starPaletteFor(el('<canvas></canvas>'))).toBe(GOLD)
    // a photograph inside a cream section is still a photograph
    const card = el(
      '<section style="background-color: #f4ecdc"><img alt="" src="/x.jpg" /></section>',
    )
    expect(starPaletteFor(card.querySelector('img'))).toBe(GOLD)
  })

  it('lets a section pin its own stars, as the hero does', () => {
    const hero = el(
      '<section data-stars="gold" style="background-color: #e8dcc8"><p>x</p></section>',
    )
    expect(starPaletteFor(hero.querySelector('p'))).toBe(GOLD)
    const pinnedOrange = el(
      '<section data-stars="orange" style="background-color: #111"><p>x</p></section>',
    )
    expect(starPaletteFor(pinnedOrange.querySelector('p'))).toBe(ORANGE)
  })

  it('makes orange stars more solid than gold ones, so they read on cream', () => {
    expect(ORANGE.opacity).toBeGreaterThan(GOLD.opacity)
  })
})
