import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'

/**
 * The real process.ts always holds the approved steps, so the page's
 * "no data" branch can only be reached by mocking the module — in isolation,
 * in this file only, so nothing else in the suite sees an empty process.
 */
vi.mock('../../src/data/process', () => ({ processSteps: [] }))

describe('process page with no approved steps', () => {
  it('still renders a valid page: one h1, the CTA, and no broken process markup', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/process']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Our construction process.' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Let’s Create a Lasting Legacy.' }),
    ).toBeInTheDocument()

    // No overview, no journey, no empty lists or stray headings.
    expect(screen.queryByRole('navigation', { name: 'Process stages' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'The sequence.' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Stage by stage.' })).not.toBeInTheDocument()
    expect(container.querySelector('[data-stage]')).toBeNull()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })
})
