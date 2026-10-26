/**
 * Timing and camera numbers for the eagle hero (EagleHero.tsx). Everything here is measured against
 * the supplied footage and still — re-measure CLIP_EYE / EYE_X / EYE_Y / CAMERA_SCALE if either changes.
 *
 * The hero is one continuous sequence: the flight clip plays (the eagle sweeps in and ends in a
 * perched pose) -> the clip dissolves into the still of the eagle on the roof, zoomed in tight on the
 * bird -> the camera pulls back until the whole building and the whole eagle are in frame -> while it
 * pulls back, VISAKRAM falls in from the top, one letter after another -> the camera then follows the
 * mouse in perspective.
 */

/** The scene is laid out on a fixed 1920x1080 stage, scaled to cover the hero. */
export const STAGE_W = 1920
export const STAGE_H = 1080

/** eagle-flight.mp4 runs 6.00s; if it cannot play, hand off after this many seconds. */
export const CLIP_FALLBACK_AT = 7.5
/** Seconds after load when the copy starts to arrive (the midpoint of the flight). */
export const REVEAL_AT = 3.0

/* After the handoff, in seconds. */
export const PULL_AT = 0.2
export const PULL_DUR = 6
export const DROP_AT = PULL_AT + 0.7 // the first letter of the wordmark starts to fall
export const DROP_STEP = 0.3 // between one letter starting to fall and the next
export const DROP_DUR = 1.25 // each letter's fall
/** The pull-back is over, the last letter has landed: the camera may start to follow the mouse. */
export const SETTLE_AT = PULL_AT + PULL_DUR + 0.3

/** In the clip's last frame the eagle's eye is at this stage position... */
export const CLIP_EYE = { x: 732, y: 224 }
/** ...and the still starts zoomed in about this point, drawn at identity: the middle of the "VISAKRAM BUILDERS" sign on the tower. */
export const EYE_X = 1370
export const EYE_Y = 432
/**
 * Where a narrow screen is centred while the clip plays, as [seconds into the clip, stage x]: the
 * middle of the eagle's body, read off the footage every half second (it enters at the left, crosses
 * the middle and perches with its head at about 640-730). A screen narrower than the 1920 stage shows
 * only part of it, so the view follows the bird instead of waiting at the tower. After the handoff the
 * view pans on to EYE_X.
 */
export const FLIGHT_PATH: ReadonlyArray<readonly [number, number]> = [
  [0, 330],
  [0.5, 560],
  [1, 580],
  [1.5, 720],
  [2, 840],
  [2.5, 900],
  [3, 900],
  [3.5, 840],
  [4, 850],
  [5, 860],
  [6, 860],
]

/** The stage x the view is centred on `t` seconds into the clip (linear between the readings). */
export function flightCentre(t: number): number {
  const first = FLIGHT_PATH[0]!
  const last = FLIGHT_PATH[FLIGHT_PATH.length - 1]!
  if (t <= first[0]) return first[1]
  if (t >= last[0]) return last[1]
  for (let i = 1; i < FLIGHT_PATH.length; i += 1) {
    const [t1, x1] = FLIGHT_PATH[i]!
    if (t <= t1) {
      const [t0, x0] = FLIGHT_PATH[i - 1]!
      return x0 + ((x1 - x0) * (t - t0)) / (t1 - t0)
    }
  }
  return last[1]
}
/**
 * The top of the tower's roof (its glass railing) on the stage, once the camera's slight push-in is
 * counted (the roof is at about y=323 on the stage itself; the 1.1x push about the stage's lower middle
 * lifts it to about 290). On a window wider than 16:9 the stage is cropped from the top, so
 * useStageFit lowers the stage until that top clears the header by HEAD_CLEAR screen px, as far as the
 * stage has room to move.
 */
export const HEAD_Y = 290
/** Screen px the top of the head should sit below the top of the hero: the header (88px) and a margin. */
export const HEAD_CLEAR = 116

/** The camera begins scaled about the still's eye so the bird the clip leaves is the bird the move starts from. */
export const CAMERA_SCALE = 2.8
export const CAMERA_FROM = { x: CLIP_EYE.x - EYE_X, y: CLIP_EYE.y - EYE_Y }

/* Mouse camera. CAM_PUSH is the overscan that keeps the picture's edges out of view when it tilts.
   Angles are degrees at the screen edge; shifts are px on the 1920 artboard. */
export const CAM_PUSH = 1.1
export const CAM_TILT_Y = 3.1
export const CAM_TILT_X = 2.1
export const UI_SHIFT_X = 18
export const UI_SHIFT_Y = 10
export const UI_TILT_Y = 1.3
export const UI_TILT_X = 0.9
export const CAM_PERSPECTIVE = 1500

/**
 * The dive. A lit window on the big tower at the right is a doorway into the
 * Home Tour that follows the hero: scrolling flies the camera into that window (useScrollDive), and
 * clicking it carries the page down to the tour (flyToSection) so the same zoom plays. The zoom is
 * stylised — a window in the still is only a few pixels wide — so it is hidden behind a blur and a
 * fade rather than magnified to fill the screen, and the view fills with the tour's ground.
 *
 * DIVE_WINDOW is in stage px. The 1678x937 still is drawn to cover the 1920x1080 stage, so image px are
 * x 1.153, less 7 px across (the window is at about 1400, 560 in the image, on the big tower at the
 * right). Re-measure it, and EYE_X / EYE_Y, if hero-city.webp changes.
 */
export const DIVE_WINDOW = { x: 1610, y: 645 }
/** The section the window leads to: the Home Tour (a CSS selector). */
export const DIVE_TARGET = '#home-tour'
/** Seconds the click-through flight takes. */
export const DIVE_FLIGHT = 2.8
export const DIVE_SCALE = 22

/**
 * Scroll distances, in viewport heights, on top of one screen of hero. The hero stays pinned for both:
 * first the zoom through the window (DIVE_VH), during which the picture dissolves into the Home Tour's
 * own first frame, then the hero fades away in place (FADE_VH) over the tour pinned beneath it. The
 * tour is pulled up under the hero by exactly that much (see EagleHero.module.css), so its first frame
 * is already on screen when the hero lets go and there is no cream, no seam and no slide.
 */
export const DIVE_VH = 240
export const FADE_VH = 60
export const SCROLL_DIVE = `${DIVE_VH + FADE_VH}svh`
export const SCROLL_FADE = `${FADE_VH}svh`
/** The share of the hero's scroll spent on the zoom; the rest is the fade. */
export const DIVE_SHARE = DIVE_VH / (DIVE_VH + FADE_VH)
