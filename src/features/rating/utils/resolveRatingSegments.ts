export type RatingSegment = 'empty' | 'full' | 'half';

/*** Resolves a numeric rating into full, half, and empty visual segments. */
export function resolveRatingSegments({ value, max }: ResolveRatingSegmentsInput): RatingSegment[] {
  const normalizedMax = Math.max(0, Math.trunc(Number.isFinite(max) ? max : 0));
  const normalizedValue = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), normalizedMax);

  return Array.from({ length: normalizedMax }, (_, index) => {
    const remaining = normalizedValue - index;
    if (remaining >= 1) return 'full';
    if (remaining >= 0.5) return 'half';
    return 'empty';
  });
}

interface ResolveRatingSegmentsInput {
  value: number;
  max: number;
}
