export type ProcessStep = {
  index: string
  title: string
  description: string
}

/**
 * The approved construction process
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §08). Step names are
 * fixed — do not rename without the client re-approving the sequence.
 */
export const processSteps: readonly ProcessStep[] = [
  {
    index: '01',
    title: 'Consult',
    description: "Understanding the client's requirement, on site and in detail.",
  },
  {
    index: '02',
    title: 'Plan',
    description: 'Scope, estimation, design and preparation, agreed before work begins.',
  },
  {
    index: '03',
    title: 'Build',
    description: 'Execution and coordination on site, stage by stage.',
  },
  {
    index: '04',
    title: 'Quality',
    description: 'Inspection and quality control at every stage, not just at the end.',
  },
  {
    index: '05',
    title: 'Handover',
    description: 'Completion and client handover.',
  },
]
