export function resolveProgressFraction({ value, max }: { value: number; max: number }): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  const fraction = value / max;

  if (fraction <= 0) {
    return 0;
  }

  if (fraction >= 1) {
    return 1;
  }

  return fraction;
}
