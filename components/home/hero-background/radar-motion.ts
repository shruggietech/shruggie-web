export const RADAR_INTRO_MS = 1400;
export const MAX_SWEEP_DEGREES_PER_SECOND = 150;
const DEGREES_PER_POINTER_PIXEL = .42;
const MAX_POINTER_STEP_DEGREES = 24;
const MAX_QUEUED_DEGREES = 75;

/** Mouse travel adds only clockwise rotation, with a short bounded tail. */
export function queueClockwiseSweep(current: number, queued: number, distancePx: number): number {
  const step = Math.min(Math.max(0, distancePx) * DEGREES_PER_POINTER_PIXEL, MAX_POINTER_STEP_DEGREES);
  return current + Math.min(MAX_QUEUED_DEGREES, Math.max(0, queued - current) + step);
}

/** Move toward the requested bearing without exceeding the angular speed cap. */
export function advanceClockwiseSweep(current: number, queued: number, elapsedMs: number): number {
  const frameMs = Math.min(Math.max(0, elapsedMs), 50);
  return Math.min(Math.max(current, queued), current + MAX_SWEEP_DEGREES_PER_SECOND * frameMs / 1000);
}
