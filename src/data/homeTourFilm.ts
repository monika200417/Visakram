/**
 * The Home Tour film — one continuous walkthrough video, scrubbed by scroll
 * (docs/VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md Chapter 07B). The video
 * itself is the only source of truth for the sequence: the chapters below are
 * time ranges into it, read off the actual footage, not separate scenes.
 *
 * Pure data and pure functions — no DOM, no React — so the timing can be
 * tested and tuned in one place.
 */
export const homeTourFilm = {
  /**
   * Encoded for scrubbing: H.264 1920×1080 at 30 fps with a keyframe every 6 frames, no B-frames and
   * no audio track (docs/PERFORMANCE-BUDGET.md §31B), so any frame is at most five frames of decoding
   * away and a seek takes a few milliseconds. A film with sparse keyframes (the usual export) makes
   * every seek decode from the previous keyframe and the scroll stutters badly. Re-encode with the
   * same settings if the film is ever replaced.
   */
  src: '/assets/videos/home-tour.mp4',
  /**
   * The same film for phones: 960×540, a keyframe every 3 frames, no audio, about 4 MB instead of 34.
   * A phone cannot seek a 1080p file fast enough to follow a thumb, and should not have to download it.
   * Encode with: -vf scale=960:540 -c:v libx264 -profile:v main -crf 28 -g 3 -keyint_min 3 -sc_threshold 0
   * -bf 0 -an -movflags +faststart.
   */
  srcMobile: '/assets/videos/home-tour-mobile.mp4',
  /** The video's own first frame, so nothing jumps when the video takes over. */
  poster: '/assets/videos/home-tour-poster.webp',
  /** Accessible name for the film frame: what it is, not what any one frame shows. */
  alt: 'A walkthrough film of an illustrative residence, from its living room to an ocean view, played by scrolling.',
  /** Seconds. The video is 1920×1080. */
  duration: 25.87,
  width: 1920,
  height: 1080,
} as const

export type HomeTourFilmChapter = {
  index: string
  id: string
  title: string
  /** Seconds into the video where the chapter begins; it ends where the next one begins. */
  start: number
  /** The leading words of `title`, set on a line of their own above the rest. */
  accent?: string
  /** Only the title is shown: no index number, supporting line or rule. */
  solo?: boolean
}

/**
 * The eight chapters, in film order. `start` is the initial chapter boundary
 * (checked against the footage); each chapter runs until the next one starts,
 * and the last runs to the end of the video.
 */
export const homeTourFilmChapters: readonly HomeTourFilmChapter[] = [
  { index: '01', id: 'living', title: 'Living', start: 0 },
  { index: '02', id: 'kitchen', title: 'Kitchen', start: 3.8 },
  { index: '03', id: 'staircase', title: 'Staircase', start: 7.3 },
  { index: '04', id: 'hallway', title: 'Hallway', start: 13.5 },
  { index: '05', id: 'bedroom', title: 'Bedroom', start: 16.5 },
  { index: '06', id: 'balcony', title: 'Balcony', start: 18.0 },
  { index: '07', id: 'ocean-view', title: 'Ocean View', start: 19.5 },
  {
    index: '08',
    id: 'final-reveal',
    title: 'Brick by Brick We Build Trust',
    accent: 'Brick by Brick',
    solo: true,
    start: 22.4,
  },
]

/**
 * On a phone the film's 16:9 frame is cropped to the screen's height, which cuts the Visakram logo of
 * the last frame (about 53% of the frame's width) off at both sides. Over the last seconds the picture
 * is therefore drawn back from "fills the screen" to "the whole logo fits", with its top and bottom
 * edges softened into the page. Pure numbers here; useFilmScrub applies them.
 */
export const homeTourFilmFit = {
  /** Seconds into the film where the zoom-out begins and where the logo fits. */
  from: 20.5,
  to: 23,
  /** How much of the frame's width the logo takes in the last frame. */
  logoShare: 0.53,
  /** How much of the screen's width the logo may take once it fits. */
  screenShare: 0.82,
  /** Per cent of the picture's height, at its top and at its bottom, softened once it fits. */
  edge: 16,
  edgeBottom: 8,
  /** Screen px between the foot of the picture and the statement set under it. */
  statementGap: 18,
} as const

/**
 * Where the last chapter's statement starts on a phone, in screen px from the top of the stage: just under the
 * foot of the picture, once it has been drawn back to `fitScale` and sits centred on the screen (so the
 * statement lies on the page, away from the logo).
 */
export function filmStatementTop(screenHeight: number, fitScale: number): number {
  const pictureHeight = screenHeight * fitScale
  return (screenHeight + pictureHeight) / 2 + homeTourFilmFit.statementGap
}

/** 0 (the picture fills the screen) to 1 (the logo fits) at a time into the film; eased at both ends. */
export function filmFitAtTime(time: number): number {
  const t = clamp01((time - homeTourFilmFit.from) / (homeTourFilmFit.to - homeTourFilmFit.from))
  return t * t * (3 - 2 * t)
}

/** The scale (1 or less) at which the logo fits a screen of the given size, the picture being as tall as the screen. */
export function filmFitScale(screenWidth: number, screenHeight: number): number {
  const pictureWidth = (screenHeight * homeTourFilm.width) / homeTourFilm.height
  const fit =
    (screenWidth * homeTourFilmFit.screenShare) / (homeTourFilmFit.logoShare * pictureWidth)
  return Math.min(1, fit)
}

export const homeTourFilmHeading = 'Home Tour'
export const homeTourFilmTagline = 'Experience spaces beyond walls.'

/**
 * Required wherever the tour is rendered. The residence is an illustrative
 * property tour — not a specific Visakram Builders project.
 */
export const homeTourFilmDisclaimer =
  'An illustrative residence — a conceptual architectural study, not a specific Visakram Builders project.'

/**
 * Scroll distance the pinned film occupies, in viewport heights of scroll per
 * second of video. Tune the pacing here, never in JSX: at 0.38 the whole film
 * takes about ten viewport heights, and the shortest chapter (Balcony,
 * 1.5 s) still gets a comfortable fraction of one screen.
 */
export const HOME_TOUR_FILM_VH_PER_SECOND = 0.38

/** Total pinned scroll distance, as a percentage of the viewport height. */
export const homeTourFilmScrollPercent = Math.round(
  homeTourFilm.duration * HOME_TOUR_FILM_VH_PER_SECOND * 100,
)

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Normalized scroll progress (0–1) → time into the video, in seconds. Linear, clamped. */
export function filmTimeAtProgress(progress: number): number {
  return clamp01(progress) * homeTourFilm.duration
}

/** Time into the video → normalized progress (0–1). The inverse of `filmTimeAtProgress`. */
export function filmProgressAtTime(time: number): number {
  return clamp01(time / homeTourFilm.duration)
}

/** The chapter that is showing at a time into the video. Boundaries belong to the chapter they begin. */
export function chapterIndexAtTime(
  time: number,
  chapters: readonly HomeTourFilmChapter[] = homeTourFilmChapters,
): number {
  let active = 0
  for (let i = 0; i < chapters.length; i += 1) {
    if (time >= chapters[i]!.start) active = i
  }
  return active
}

/** The chapter that is showing at a normalized progress value. */
export function chapterIndexAtProgress(progress: number): number {
  return chapterIndexAtTime(filmTimeAtProgress(progress))
}

/** A chapter's normalized progress range, derived from its start time. */
export function chapterProgressRange(index: number): { from: number; to: number } {
  const chapter = homeTourFilmChapters[index]
  if (!chapter) throw new Error(`No Home Tour film chapter at index ${index}`)
  const next = homeTourFilmChapters[index + 1]
  return {
    from: filmProgressAtTime(chapter.start),
    to: next ? filmProgressAtTime(next.start) : 1,
  }
}
