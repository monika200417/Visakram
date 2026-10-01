export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Remaps `value` from [inMin, inMax] to [outMin, outMax], clamped to the output range. */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = clamp01((value - inMin) / (inMax - inMin))
  return outMin + (outMax - outMin) * t
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
