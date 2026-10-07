import { render } from '@testing-library/react'
import { gsap } from 'gsap'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadGsap } from '../../src/animations/gsap'
import { ProcessJourney } from '../../src/components/process/ProcessJourney'
import type { ProcessStep } from '../../src/data/process'

const steps: ProcessStep[] = [
  { index: '01', title: 'Test Fixture One', description: 'Test fixture description one.' },
  { index: '02', title: 'Test Fixture Two', description: 'Test fixture description two.' },
  { index: '03', title: 'Test Fixture Three', description: 'Test fixture description three.' },
]

const originalMatchMedia = window.matchMedia

function setReducedMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced ? /reduce/.test(query) : /no-preference/.test(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

/** Let the hook's `loadGsap().then(...)` run (it was registered before ours). */
async function settle() {
  await loadGsap()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

beforeEach(() => setReducedMotion(false))
afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('useProcessJourney', () => {
  it('with motion allowed, runs the animated branch and marks every stage with a state', async () => {
    // jsdom has no layout, so ScrollTrigger's scrub progress is meaningless here:
    // the stage state is the reliable proof that the animated branch ran.
    const { container } = render(<ProcessJourney steps={steps} />)
    await settle()

    const stages = Array.from(container.querySelectorAll<HTMLElement>('[data-stage]'))
    expect(stages).toHaveLength(steps.length)
    for (const stage of stages) {
      expect(['reached', 'active', 'pending']).toContain(stage.dataset.state)
    }
    expect(stages.filter((stage) => stage.dataset.state === 'active')).toHaveLength(1)
  })

  it('under reduced motion, leaves the finished journey: line fully drawn, no stage state set', async () => {
    setReducedMotion(true)
    const { container } = render(<ProcessJourney steps={steps} />)
    await settle()

    const progress = container.querySelector('[class*="progress"]') as HTMLElement
    expect(gsap.getProperty(progress, 'scaleY')).toBe(1)
    container
      .querySelectorAll('[data-stage]')
      .forEach((stage) => expect(stage).not.toHaveAttribute('data-state'))
  })

  it('removes its stage state again when it unmounts or motion is reverted', async () => {
    const { container, unmount } = render(<ProcessJourney steps={steps} />)
    await settle()
    const stages = Array.from(container.querySelectorAll<HTMLElement>('[data-stage]'))
    expect(stages.every((stage) => stage.dataset.state)).toBe(true)

    unmount()
    stages.forEach((stage) => expect(stage).not.toHaveAttribute('data-state'))
  })
})
