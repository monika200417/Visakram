export type NavItem = { label: string; to: string }

/** docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §04 */
export const primaryNavigation: readonly NavItem[] = [
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Process', to: '/process' },
  { label: 'Contact', to: '/contact' },
]

export const primaryCta: NavItem = { label: 'Start a Project', to: '/contact' }
