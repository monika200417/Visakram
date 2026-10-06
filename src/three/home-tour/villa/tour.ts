import { buildTour } from '../cameraPath'
import { waypoints } from './waypoints'

/** The villa's camera timeline: sample(p) is the pose at normalized scroll progress p. */
export const villaTour = buildTour(waypoints)
export { waypoints as villaWaypoints }
