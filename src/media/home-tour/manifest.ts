import { homeTourChapters, type HomeTourChapter } from '../../data/homeTour'

/**
 * Where each chapter's footage lives. This file is the ONLY place that knows
 * about media files and timing: the section, the media component, the scroll
 * hook and the journey line all read the joined `homeTourSequence` below, so
 * production clips can replace these without touching any component.
 *
 * A chapter with no entry here simply has no footage yet and is not part of
 * the scroll timeline (Phase 1 carries two chapters; the rest follow).
 */
export type HomeTourMediaEntry = {
  /** The id of the editorial chapter in src/data/homeTour.ts. */
  id: string
  /** URL of the chapter's clip. */
  video: string
  /** URL of the still shown before the clip is ready, and when it cannot play. */
  poster: string
  /** Seconds into `video` where the chapter's movement begins… */
  start: number
  /** …and ends. Scrolling through the chapter plays this range. */
  end: number
  /**
   * Scroll distance the chapter occupies, in viewport heights. Chapters share
   * the pin in proportion to this, so tune pacing here, never in JSX.
   */
  scrollVh: number
  /** True while the entry points at unconfirmed reference media that must not ship. */
  placeholder: boolean
}

const PLACEHOLDER = '/assets/home-tour/placeholder'

export const homeTourMedia: readonly HomeTourMediaEntry[] = [
  {
    id: 'exterior',
    video: `${PLACEHOLDER}/reference-walkthrough.mp4`,
    poster: `${PLACEHOLDER}/exterior.webp`,
    // First clip of the reference reel (a slow push-in on the front elevation)
    start: 0.05,
    end: 1.25,
    scrollVh: 200,
    placeholder: true,
  },
  {
    id: 'staircase',
    video: `${PLACEHOLDER}/reference-walkthrough.mp4`,
    poster: `${PLACEHOLDER}/staircase.webp`,
    // The lit stair flight under the chandeliers (a slow downward drift)
    start: 10.05,
    end: 10.95,
    scrollVh: 200,
    placeholder: true,
  },
]

/** Shortest hold between two clips' own frames, as a share of total scroll progress. */
export const HOME_TOUR_HANDOFF = 0.06

/** An editorial chapter joined with its media: everything the experience needs about one chapter. */
export type HomeTourSceneChapter = HomeTourChapter & Omit<HomeTourMediaEntry, 'id'>

/**
 * The chapters that have footage, in tour order (the order of the editorial
 * data, not of the manifest). Throws at module load if the manifest names a
 * chapter that does not exist or has an impossible time range — a broken
 * manifest must fail loudly, not render a blank section.
 */
export function joinChapters(
  chapters: readonly HomeTourChapter[],
  media: readonly HomeTourMediaEntry[],
): HomeTourSceneChapter[] {
  for (const entry of media) {
    if (!chapters.some((c) => c.id === entry.id)) {
      throw new Error(`Home Tour media entry "${entry.id}" has no editorial chapter`)
    }
    if (!(entry.end > entry.start) || entry.start < 0 || !(entry.scrollVh > 0)) {
      throw new Error(`Home Tour media entry "${entry.id}" has an invalid range or scroll length`)
    }
  }
  const joined: HomeTourSceneChapter[] = []
  for (const chapter of chapters) {
    const entry = media.find((m) => m.id === chapter.id)
    if (!entry) continue
    joined.push({
      ...chapter,
      video: entry.video,
      poster: entry.poster,
      start: entry.start,
      end: entry.end,
      scrollVh: entry.scrollVh,
      placeholder: entry.placeholder,
    })
  }
  return joined
}

export const homeTourSequence: readonly HomeTourSceneChapter[] = joinChapters(
  homeTourChapters,
  homeTourMedia,
)

/** The length of the pinned scroll, in viewport heights (a percentage, as ScrollTrigger's `end` expects). */
export const homeTourPinPercent = homeTourSequence.reduce((sum, c) => sum + c.scrollVh, 0)
