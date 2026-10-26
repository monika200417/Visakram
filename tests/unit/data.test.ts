import { describe, expect, it } from 'vitest'
import { founderBackgroundDisclaimer, founders, getFounderBySlug } from '../../src/data/founders'
import { primaryNavigation } from '../../src/data/navigation'
import { processSteps } from '../../src/data/process'
import { getFeaturedProject, getProjectBySlug, projects } from '../../src/data/projects'
import { getServiceByCategory, getServiceBySlug, services } from '../../src/data/services'
import { site } from '../../src/data/site'
import { getTestimonialById, testimonials } from '../../src/data/testimonials'
import { assertUniqueIdentifiers } from '../../src/data/validate'
import { visakramWayPrinciples } from '../../src/data/visakramWay'

describe('data layer', () => {
  it('has no invented projects', () => {
    expect(projects).toHaveLength(0)
    expect(getProjectBySlug('anything')).toBeUndefined()
    expect(getFeaturedProject()).toBeUndefined()
  })

  it('has the client-supplied phone numbers, email and WhatsApp number, and leaves the unconfirmed details undefined', () => {
    expect(site.phones).toEqual(['+91 95154 52875', '+91 95154 52876', '+91 95737 60438'])
    expect(site.phone).toBe(site.phones[0])
    expect(site.email).toBe('hello@visakrambuilders.com')
    expect(site.whatsappNumber).toBe(site.phones[0])
    expect(site.siteUrl).toBeUndefined()
    expect(site.aboutImage).toBeUndefined()
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

  it('has exactly the three verified services, matching the project category union', () => {
    expect(services).toHaveLength(3)
    expect(services.map((s) => s.title)).toEqual([
      'Villas',
      'Apartments',
      'Residential Construction',
    ])
    expect(services.map((s) => s.category)).toEqual(['villa', 'apartment', 'residential'])
    expect(getServiceBySlug('villas')?.title).toBe('Villas')
    expect(getServiceByCategory('apartment')?.slug).toBe('apartments')
    expect(getServiceBySlug('not-a-real-service')).toBeUndefined()
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

  it('has exactly the two verified founders, with no invented role or photo', () => {
    expect(founders).toHaveLength(2)
    expect(founders.map((f) => f.name)).toEqual(['Shanmukesh Sirikolla', 'Venkata Satish Anne'])
    for (const founder of founders) {
      // No formal Visakram title has been verified — positioning describes
      // skill focus, never an invented role like "Co-Founder" or "CEO".
      expect(founder.positioning.length).toBeGreaterThan(0)
      expect(founder.image).toBeUndefined()
    }
    expect(getFounderBySlug('shanmukesh-sirikolla')?.name).toBe('Shanmukesh Sirikolla')
    expect(getFounderBySlug('not-a-real-founder')).toBeUndefined()
    // The disclaimer that prior employment isn't Visakram Builders' own
    // project history must exist wherever founder background is defined.
    expect(founderBackgroundDisclaimer.toLowerCase()).toContain('does not mean')
  })

  it('has no invented testimonials', () => {
    expect(testimonials).toHaveLength(0)
    expect(getTestimonialById('anything')).toBeUndefined()
  })

  describe('assertUniqueIdentifiers', () => {
    it('passes for unique, present identifiers', () => {
      expect(() =>
        assertUniqueIdentifiers([{ slug: 'a' }, { slug: 'b' }], 'slug', 'test'),
      ).not.toThrow()
    })

    it('throws on a duplicate identifier', () => {
      expect(() => assertUniqueIdentifiers([{ slug: 'a' }, { slug: 'a' }], 'slug', 'test')).toThrow(
        /duplicate/,
      )
    })

    it('throws on a missing identifier', () => {
      expect(() => assertUniqueIdentifiers([{ slug: '' }], 'slug', 'test')).toThrow(/missing/)
    })
  })
})
