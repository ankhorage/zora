export function normalizeHueDegrees(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

export function rotateHueDegrees(hue: number, delta: number): number {
  return normalizeHueDegrees(hue + delta);
}
