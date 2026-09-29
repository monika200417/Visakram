import { site } from './site'

export type WayPrinciple = {
  index: string
  title: string
  description: string
}

/**
 * Supporting copy for each of the three verified company values
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md §06). Titles are
 * derived from site.values — the single verified source — rather than
 * duplicated here, so this list can never drift from it or grow a fourth,
 * invented principle.
 */
const descriptions: Record<string, string> = {
  Quality:
    'Every material, finish and structural detail is chosen and checked before it becomes part of your home.',
  Timeliness:
    'Clear schedules and steady progress from groundbreaking to handover, so you always know where your project stands.',
  Transparency:
    'Open communication at every stage, so decisions, costs and progress are never a surprise.',
}

export const visakramWayPrinciples: readonly WayPrinciple[] = site.values.map((title, i) => ({
  index: String(i + 1).padStart(2, '0'),
  title,
  description: descriptions[title] ?? '',
}))
