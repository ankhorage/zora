/*** Clamp one game presentation coordinate to the inclusive field-percentage range. */
export function clampGamePercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}
