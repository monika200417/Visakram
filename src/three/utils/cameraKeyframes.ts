/**
 * Restrained camera stops anchored to the same progress breakpoints as
 * the construction stages (Plan 0–0.15, Foundation 0.15–0.30, Structure
 * 0.30–0.50, Floors 0.50–0.65, Facade 0.65–0.85, Place 0.85–1.00) —
 * Milestone 10 redesign §"camera": near top-down at the start, gradually
 * lowering and rotating toward an elevated 3/4 hero composition by the
 * end. The camera eases between the two keyframes bracketing the current
 * scroll progress; it never orbits and the look-at target barely moves.
 */
export type CameraKeyframe = {
  /** Normalized scroll progress (0–1) this keyframe is anchored to. */
  progress: number
  position: readonly [number, number, number]
  fov: number
}

export const cameraKeyframes: readonly CameraKeyframe[] = [
  { progress: 0, position: [0, 8.6, 1.0], fov: 38 }, // Plan — near top-down over the site
  { progress: 0.15, position: [1.6, 7.8, 3.2], fov: 38 }, // Foundation — camera begins lowering
  { progress: 0.3, position: [3.2, 6.2, 5.0], fov: 37 }, // Structure — elevated technical perspective
  { progress: 0.5, position: [4.4, 4.9, 6.3], fov: 36 }, // Floors — progressively stronger perspective
  { progress: 0.65, position: [5.2, 4.1, 7.1], fov: 35 }, // Facade — architectural 3/4
  { progress: 0.85, position: [5.9, 3.7, 7.7], fov: 34 }, // (Facade -> Place transition)
  { progress: 1, position: [6.6, 4.2, 8.5], fov: 32 }, // Place — elevated 3/4 hero composition
]

export const cameraLookAt: readonly [number, number, number] = [-0.15, 1.85, 0]

/**
 * How far the whole camera path sits from the look-at target, as a multiple of the
 * keyframe distances above. Every keyframe keeps its own direction and fov (angle,
 * perspective and the animation are unchanged); only the distance grows, so more of
 * the building fits inside the frame.
 */
const CAMERA_PULLBACK = 1.6

/** Interpolates position + fov between the two keyframes bracketing `progress` (0–1). */
export function sampleCamera(progress: number): {
  position: [number, number, number]
  fov: number
} {
  const clamped = Math.min(1, Math.max(0, progress))

  let index = 0
  while (index < cameraKeyframes.length - 2 && clamped >= cameraKeyframes[index + 1]!.progress) {
    index += 1
  }

  const from = cameraKeyframes[index]!
  const to = cameraKeyframes[index + 1]!
  const span = to.progress - from.progress
  const t = span > 0 ? (clamped - from.progress) / span : 0

  const at = (axis: 0 | 1 | 2) => {
    const interpolated = from.position[axis] + (to.position[axis] - from.position[axis]) * t
    return cameraLookAt[axis] + (interpolated - cameraLookAt[axis]) * CAMERA_PULLBACK
  }

  return {
    position: [at(0), at(1), at(2)],
    fov: from.fov + (to.fov - from.fov) * t,
  }
}
