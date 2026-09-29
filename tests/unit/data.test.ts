import { describe, expect, it } from 'vitest'
import { buildCategories } from '../../src/data/buildCategories'
import { primaryNavigation } from '../../src/data/navigation'
import { processSteps } from '../../src/data/process'
import { getProjectBySlug, projects } from '../../src/data/projects'
import { site } from '../../src/data/site'
import { visakramWayPrinciples } from '../../src/data/visakramWay'

describe('data layer', () => {
  it('has no invented projects', () => {
    expect(projects).toHaveLength(0)
    expect(getProjectBySlug('anything')).toBeUndefined()
  })

  it('leaves unconfirmed business details undefined', () => {
    expect(site.phone).toBeUndefined()
    expect(site.whatsappNumber).toBeUndefined()
    expect(site.siteUrl).toBeUndefined()
  })

  it('navigation matches the blueprint', () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      'Projects',
      'Services',
      'About',
      'Process',
      'Contact',
    ])
  })

  it('has exactly the three approved build categories, matching the project category union', () => {
    expect(buildCategories).toHaveLength(3)
    expect(buildCategories.map((c) => c.title)).toEqual([
      'Villas',
      'Apartments',
      'Residential Construction',
    ])
    expect(buildCategories.map((c) => c.id)).toEqual(['villa', 'apartment', 'residential'])
  })

  it('has exactly the five approved process steps, in order', () => {
    expect(processSteps).toHaveLength(5)
    expect(processSteps.map((s) => s.title)).toEqual([
      'Consult',
      'Plan',
      'Build',
      'Quality',
      'Handover',
    ])
  })

  it('derives the Visakram Way principles from site.values, not an independent list', () => {
    expect(visakramWayPrinciples).toHaveLength(3)
    expect(visakramWayPrinciples.map((p) => p.title)).toEqual([...site.values])
    for (const principle of visakramWayPrinciples) {
      expect(principle.description.length).toBeGreaterThan(0)
    }
  })
})
