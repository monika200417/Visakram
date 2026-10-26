import { homeTourChapters, type HomeTourChapter } from '../../data/homeTour'

/**
 * Where each chapter's media lives. This file is the ONLY place that knows about
 * the Home Tour's media files: the homepage hero reads each chapter's still from
 * the joined `homeTourSequence` below, so production stills can be dropped in
 * here without touching any component. (The old scroll-driven Home Tour section
 * that also read the clips and scroll weights has been removed; `video`, `start`,
 * `end`, `scrollVh` and `brief` stay as data for planning the production media.)
 *
 * All nine chapters have an entry. A chapter's media comes in three
 * honest states (`status`):
 *
 *  - `production`     — cleared production footage and poster (none yet).
 *  - `reference-only` — only a REFERENCE still exists (development use; stripped
 *                       from production builds); the production clip is still needed.
 *  - `missing`        — no reference and no footage exist at all. Nothing is
 *                       invented or borrowed: the chapter shows a quiet panel
 *                       until production media is supplied.
 *
 * Reference stills are third-party, AI-marked images (some carry a house number,
 * a brand poster and a tool watermark). They live under /placeholder/, are only
 * used in development, and are removed from production builds (vite.config.ts).
 */
export type HomeTourMediaStatus = 'production' | 'reference-only' | 'missing'

export type HomeTourMediaEntry = {
  /** The id of the editorial chapter in src/data/homeTour.ts. */
  id: string
  /**
   * Scroll distance the chapter occupies, in viewport heights. Chapters share
   * the pin in proportion to this. Kept as data for the production media plan; the
   * homepage hero does not use it.
   */
  scrollVh: number
  /** URL of the production clip, or null while it is still to be supplied. */
  video: string | null
  /** Seconds into `video` where the chapter's movement begins and ends (0 and 0 with no video). */
  start: number
  end: number
  /** URL of the cleared production poster still, or null while it is still to be supplied. */
  poster: string | null
  /** URL of the development REFERENCE still (never used in production), or null if none exists. */
  reference: string | null
  /** The reference's filename in docs/reference/home-tour/, for traceability. */
  source: string | null
  /** Still for mobile / reduced motion. Defaults to the poster, then the reference. */
  mobile: string | null
  /**
   * How the still fills a 16:9 frame: `cover` (default) crops to fill; `contain` shows
   * the whole image, for references that are not 16:9 (portrait or square).
   */
  fit?: 'cover' | 'contain'
  status: HomeTourMediaStatus
  /** What production media this chapter still needs (shown in the media report, not on the page). */
  brief: string
}

const REF = '/assets/home-tour/placeholder'

export const homeTourMedia: readonly HomeTourMediaEntry[] = [
  {
    id: 'exterior',
    scrollVh: 180,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/exterior.webp`,
    source: 'master-exterior.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: a slow, stabilized approach on the front elevation at blue hour, ending near the entrance. Remove the gate house number from the footage.',
  },
  {
    id: 'entry',
    scrollVh: 110,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/entry.webp`,
    source: 'master-entry.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera crosses the threshold into the foyer. NOTE: master-entry.png actually shows a first-floor lounge (with a third-party brand poster), not an entry; a true threshold/foyer shot is needed.',
  },
  {
    id: 'living',
    scrollVh: 180,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/living.webp`,
    source: 'living-room.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera settles into the main living space. The supplied reference (living-room.png, 1672×941) is an open-plan living room in warm walnut, travertine and cream, with a TV wall, a large sectional, and the kitchen island and dining table visible beyond. It shows no watermark, but its rights are unconfirmed and it is not verified as the same house as the exterior and stair references.',
  },
  {
    id: 'dining',
    scrollVh: 110,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/dining.webp`,
    source: 'dining-room.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera continues through the open plan to the dining area. The supplied reference (dining-room.png, 1671×941) is a long walnut dining table with upholstered chairs, the kitchen to its left, the living space to its right, and sliding glass doors to a palm-lined terrace and the sea. It shows no watermark, but its rights are unconfirmed and it is not verified as the same house as the exterior and stair references. kitchen.jpeg also shows a dining table at its left edge (the alternative if a combined dining and kitchen shot is preferred).',
  },
  {
    id: 'kitchen',
    scrollVh: 110,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/kitchen.webp`,
    source: 'kitchen.jpeg',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the kitchen and its relationship to the dining area. The supplied reference (1150×767) is a high-quality professional photograph of a modern dark-walnut kitchen with a waterfall island, closest in language to the villa, but it shows a stainless-steel fridge and a different (desert-light) setting; its provenance and rights are unknown.',
  },
  {
    id: 'staircase',
    scrollVh: 180,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/staircase.webp`,
    source: 'master-staircase.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: a vertical move through the double-height stair void, chandeliers and glass balustrade.',
  },
  {
    id: 'bedroom',
    scrollVh: 120,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/bedroom.webp`,
    source: 'master-bedroom.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera opens into the private upper-level bedroom. The supplied reference (master-bedroom.png, 1671×941) is a bedroom with a walnut-panelled headboard wall, a walk-in wardrobe and en-suite beyond, and a ceiling fan, in warm walnut and cream. It shows no watermark, but its rights are unconfirmed and its finish is not verified against the exterior reference.',
  },
  {
    id: 'balcony',
    scrollVh: 180,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/balcony.webp`,
    source: 'master-balcony.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera moves toward the ocean-facing terrace. The supplied reference (master-balcony.png, 1671×941) is a covered terrace with a timber ceiling, lounge seating and a glass balustrade at sunset, with palms and a beach below. It shows no watermark, but the sunset coastal setting still differs from the exterior reference (an inland street at blue hour), so the setting and light must be reconciled.',
  },
  {
    id: 'reveal',
    scrollVh: 200,
    video: null,
    start: 0,
    end: 0,
    poster: null,
    reference: `${REF}/final-reveal.webp`,
    source: 'final-reveal.png',
    mobile: null,
    status: 'reference-only',
    brief:
      '16:9 clip: the camera exits the terrace, pulls outward and rises, returning to the exterior composition of the opening. final-reveal.png is INTENTIONALLY a byte-identical copy of master-exterior.png: the tour opens on "here is the villa" and closes on "here is the completed place". Final Reveal remains its own chapter, so its production clip can use a different camera movement toward the same composition.',
  },
]

/**
 * Whether development REFERENCE stills may be shown: always in `npm run dev`,
 * and in a production build only when VITE_HOME_TOUR_ALLOW_PLACEHOLDERS=1 (a
 * local preview; the same variable keeps the files in dist/ — see vite.config.ts).
 */
export const ALLOW_REFERENCE_STILLS =
  import.meta.env.DEV || import.meta.env.VITE_HOME_TOUR_ALLOW_PLACEHOLDERS === '1'

/** An editorial chapter joined with its media: everything the experience needs about one chapter. */
export type HomeTourSceneChapter = HomeTourChapter & {
  scrollVh: number
  video: string | null
  start: number
  end: number
  /** The still to show on the stage: the production poster, else (where allowed) the reference. */
  still: string | null
  /** The still for the static / mobile / reduced-motion block. */
  mobile: string | null
  fit: 'cover' | 'contain'
  reference: string | null
  source: string | null
  status: HomeTourMediaStatus
  brief: string
}

/** Which still a chapter may show. A reference never counts unless `allowReference` is true. */
export function resolveStill(
  entry: Pick<HomeTourMediaEntry, 'poster' | 'reference'>,
  allowReference: boolean,
): string | null {
  return entry.poster ?? (allowReference ? entry.reference : null)
}

/**
 * Joins editorial chapters with their media, in TOUR order (the order of the
 * editorial data, not of the manifest). Every chapter must have an entry; a
 * manifest entry with no chapter, a missing entry, or an impossible range or
 * scroll length throws at module load — a broken manifest must fail loudly, not
 * render a blank section.
 */
export function joinChapters(
  chapters: readonly HomeTourChapter[],
  media: readonly HomeTourMediaEntry[],
  allowReference: boolean = ALLOW_REFERENCE_STILLS,
): HomeTourSceneChapter[] {
  for (const entry of media) {
    if (!chapters.some((c) => c.id === entry.id)) {
      throw new Error(`Home Tour media entry "${entry.id}" has no editorial chapter`)
    }
    if (!(entry.scrollVh > 0) || (entry.video && !(entry.end > entry.start))) {
      throw new Error(`Home Tour media entry "${entry.id}" has an invalid range or scroll length`)
    }
  }
  return chapters.map((chapter) => {
    const entry = media.find((m) => m.id === chapter.id)
    if (!entry) throw new Error(`Home Tour chapter "${chapter.id}" has no media entry`)
    const still = resolveStill(entry, allowReference)
    return {
      ...chapter,
      scrollVh: entry.scrollVh,
      video: entry.video,
      start: entry.start,
      end: entry.end,
      still,
      mobile: entry.mobile ?? still,
      fit: entry.fit ?? 'cover',
      reference: entry.reference,
      source: entry.source,
      status: entry.status,
      brief: entry.brief,
    }
  })
}

export const homeTourSequence: readonly HomeTourSceneChapter[] = joinChapters(
  homeTourChapters,
  homeTourMedia,
)
