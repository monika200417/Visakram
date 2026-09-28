import { describe, expect, it } from 'vitest'
import { primaryNavigation } from '../../src/data/navigation'
import { getProjectBySlug, projects } from '../../src/data/projects'
import { site } from '../../src/data/site'

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
})
