import { FL1 } from './plan'
import type { Waypoint } from '../cameraPath'

/**
 * The camera's route through the villa — one continuous walk, no cuts.
 *
 *   01 Exterior   from the east lawn, a wide look along the facade to the sea
 *   02 Entry      up the four stone steps, through the timber pivot door
 *   03 Living     the foyer opens west into the living room; ocean through the glass
 *   04 Dining +   west along the glazing, past the table, round the kitchen island,
 *      Kitchen    then back east along the service lane behind it
 *   05 Staircase  the foot of the timber stair, up the east wall, the quarter turn,
 *                 west along the back wall with the living room below
 *   06 Bedroom    along the gallery into the master suite
 *   07 Ocean      through the sliding glass onto the terrace
 *      Terrace
 *   08 Final      out over the glass rail, then a rising crane west and north to a
 *      Reveal     wide view of the whole villa, pool, beach and ocean
 *
 * Progress values are NOT stored here: cameraPath.ts derives them from the real
 * path length, per-segment `speed` and `dwell`. Where the view turns a long way
 * (the dining turn, the kitchen island, the stair landing, the bedroom, the
 * crane) segments are slower, which spreads the turn over more scroll and
 * keeps every scroll notch a small, smooth move. The service lane back to the
 * stair is deliberately quick.
 *
 * Walking eye height is 1.65 m above the surface underfoot: FL0 + 1.65 = 2.25
 * on the ground floor, FL1 + 1.65 = 5.75 upstairs, and the stair/step values
 * are the tread height plus 1.65.
 */
export const waypoints: readonly Waypoint[] = [
  // 01 EXTERIOR — the opening composition, from the east lawn
  {
    id: 'exterior',
    chapter: true,
    position: [40.0, 2.2, -14.0],
    lookAt: [10.0, 3.1, -3.0],
    fov: 34,
    dwell: 4,
  },
  { id: 'approachA', position: [31.0, 2.0, -9.6], lookAt: [18.0, 2.9, -1.0], fov: 38, speed: 2.0 },
  { id: 'approachB', position: [25.6, 1.8, -6.2], lookAt: [21.8, 2.7, 0.0], fov: 42, speed: 1.5 },
  { id: 'stepsFoot', position: [22.1, 1.75, -4.4], lookAt: [21.7, 2.6, 0.5], fov: 44, speed: 1.1 },
  { id: 'steps', position: [21.8, 1.95, -2.45], lookAt: [21.7, 2.5, 1.5], fov: 46, speed: 1.0 },
  // 02 ENTRY — the porch under the canopy; the pivot door opens as we arrive
  {
    id: 'entry',
    chapter: true,
    position: [21.6, 2.25, -1.1],
    lookAt: [21.6, 2.5, 3.0],
    fov: 46,
    dwell: 3,
    speed: 0.9,
  },
  { id: 'threshold', position: [21.6, 2.25, 1.2], lookAt: [21.3, 2.4, 5.0], fov: 47, speed: 1.1 },
  { id: 'foyer', position: [21.2, 2.25, 3.0], lookAt: [20.14, 2.1, 5.27], fov: 50, speed: 0.6 },
  { id: 'opening', position: [19.5, 2.25, 4.7], lookAt: [15.64, 1.9, 5.74], fov: 53, speed: 0.45 },
  // 03 LIVING — behind the sofa, the open slider and the ocean beyond
  {
    id: 'living',
    chapter: true,
    position: [17.2, 2.25, 6.4],
    lookAt: [13.51, 1.6, 1.67],
    fov: 56,
    dwell: 3.5,
    speed: 0.3,
  },
  // 04 DINING + KITCHEN — table and pendants, then round the island
  {
    id: 'diningKitchen',
    chapter: true,
    position: [12.5, 2.25, 5.5],
    lookAt: [6.8, 1.3, 3.2],
    fov: 54,
    dwell: 3,
    speed: 0.8,
  },
  {
    id: 'kitchen',
    position: [6.6, 2.25, 5.3],
    lookAt: [2.4, 1.35, 7.4],
    fov: 54,
    dwell: 3,
    speed: 0.6,
  },
  { id: 'islandA', position: [3.4, 2.25, 5.1], lookAt: [2.4, 1.3, 8.0], fov: 54, speed: 0.6 },
  { id: 'islandB', position: [1.0, 2.25, 6.3], lookAt: [3.2, 1.3, 8.2], fov: 54, speed: 0.5 },
  { id: 'islandC', position: [0.9, 2.25, 8.9], lookAt: [3.8, 1.2, 8.0], fov: 54, speed: 0.5 },
  { id: 'aisleA', position: [2.6, 2.25, 9.55], lookAt: [7.0, 1.7, 9.2], fov: 54, speed: 0.6 },
  // The service lane back east to the stair: quicker, still smooth
  { id: 'aisleB', position: [6.5, 2.25, 9.5], lookAt: [11.0, 1.8, 8.8], fov: 54, speed: 1.8 },
  { id: 'aisleC', position: [11.5, 2.25, 9.3], lookAt: [16.0, 1.9, 8.2], fov: 54, speed: 2.0 },
  { id: 'aisleD', position: [16.0, 2.25, 9.0], lookAt: [20.5, 2.1, 7.8], fov: 54, speed: 2.0 },
  {
    id: 'stairApproach',
    position: [19.2, 2.25, 7.4],
    lookAt: [22.19, 2.1, 7.66],
    fov: 54,
    speed: 0.9,
  },
  { id: 'foyerB', position: [21.0, 2.25, 6.2], lookAt: [22.92, 2.4, 7.81], fov: 54, speed: 0.36 },
  // 05 STAIRCASE — the foot of the flight, facing the slat wall
  {
    id: 'staircase',
    chapter: true,
    chapterFrom: 'stairApproach',
    position: [23.15, 2.25, 6.0],
    lookAt: [23.15, 3.6, 10.4],
    fov: 56,
    dwell: 3,
    speed: 0.33,
  },
  { id: 'flightA', position: [23.15, 2.78, 7.9], lookAt: [22.9, 4.0, 10.6], fov: 54, speed: 1.2 },
  {
    id: 'flightB',
    position: [23.15, 3.55, 9.05],
    lookAt: [22.55, 4.1, 10.48],
    fov: 54,
    speed: 0.6,
  },
  {
    id: 'landing',
    position: [23.15, 4.0, 10.2],
    lookAt: [21.51, 4.6, 11.35],
    fov: 54,
    speed: 0.45,
  },
  {
    id: 'flightC',
    position: [21.9, 4.53, 10.25],
    lookAt: [18.93, 5.3, 10.67],
    fov: 54,
    speed: 0.42,
  },
  {
    id: 'flightD',
    position: [20.7, 5.22, 10.25],
    lookAt: [17.32, 5.6, 9.34],
    fov: 54,
    speed: 0.65,
  },
  {
    id: 'stairTop',
    position: [19.3, FL1 + 1.65, 10.0],
    lookAt: [15.5, 5.4, 8.2],
    fov: 54,
    speed: 0.7,
  },
  {
    id: 'gallery',
    position: [17.6, FL1 + 1.65, 8.9],
    lookAt: [13.8, 5.3, 7.6],
    fov: 54,
    speed: 1.0,
  },
  {
    id: 'bedDoor',
    position: [16.0, FL1 + 1.65, 7.6],
    lookAt: [12.0, 5.3, 6.3],
    fov: 54,
    speed: 1.0,
  },
  // 06 BEDROOM — the bed side-on to the glass, the slatted wall behind it
  {
    id: 'bedroom',
    chapter: true,
    chapterFrom: 'bedDoor',
    position: [10.8, FL1 + 1.65, 6.4],
    lookAt: [5.0, 4.95, 4.3],
    fov: 52,
    dwell: 3.5,
    speed: 0.9,
  },
  {
    id: 'bedTurnA',
    position: [10.1, FL1 + 1.65, 5.6],
    lookAt: [7.42, 5.1, 2.63],
    fov: 52,
    speed: 0.35,
  },
  {
    id: 'bedTurn',
    position: [9.9, FL1 + 1.65, 4.4],
    lookAt: [8.78, 5.1, -0.88],
    fov: 52,
    speed: 0.35,
  },
  // The suite's sliding glass opens between here and the terrace
  {
    id: 'sliderApproach',
    position: [9.9, FL1 + 1.65, 2.2],
    lookAt: [9.9, 5.2, -4.0],
    fov: 52,
    speed: 1.0,
  },
  // 07 OCEAN TERRACE — on the terrace, the glass rail ahead, the beach below
  {
    id: 'terrace',
    chapter: true,
    position: [9.9, FL1 + 1.65, -1.2],
    lookAt: [9.9, 4.9, -9.0],
    fov: 52,
    dwell: 3.5,
    speed: 1.1,
  },
  // 08 FINAL REVEAL — out over the rail, then a rising crane that turns back to the villa
  { id: 'overRail', position: [9.6, 5.95, -3.5], lookAt: [8.0, 4.6, -12.0], fov: 50, speed: 1.2 },
  { id: 'arc0', position: [7.0, 6.2, -5.5], lookAt: [10.0, 4.2, -13.0], fov: 48, speed: 0.7 },
  { id: 'arc1', position: [3.0, 6.7, -8.5], lookAt: [12.0, 3.8, -12.0], fov: 46, speed: 0.8 },
  { id: 'arc2', position: [-6.0, 7.6, -13.5], lookAt: [14.0, 3.2, -7.0], fov: 44, speed: 1.2 },
  { id: 'arc3', position: [-20.0, 9.0, -19.0], lookAt: [18.0, 1.8, -9.0], fov: 41, speed: 1.5 },
  {
    id: 'reveal',
    chapter: true,
    chapterFrom: 'overRail',
    position: [-34.0, 10.2, -24.0],
    lookAt: [20.0, 0.5, -12.0],
    fov: 38,
    dwell: 4,
    speed: 1.6,
  },
]
