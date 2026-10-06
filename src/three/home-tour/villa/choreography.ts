import { smoothstep } from '../pathMath'
import { villaTour as tour } from './tour'

/**
 * Everything in the villa that responds to the tour, as pure functions of
 * normalized progress. The scene reads these inside useFrame; keeping them
 * free of three.js makes them cheap to unit-test.
 */
const A = tour.arrivalProgress

const between = (from: number, to: number, p: number) => smoothstep((p - from) / (to - from))

/** 0 = closed, 1 = open — the front door swings open as the camera climbs the steps. */
export const doorOpen = (p: number): number => between(A.approachB!, A.entry!, p)

/** 0 = closed, 1 = open — the suite's sliding glass parts as the bedroom turns toward it. */
export const glassOpen = (p: number): number => between(A.bedTurnA!, A.sliderApproach!, p)
