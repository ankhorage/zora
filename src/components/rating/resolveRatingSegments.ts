type RatingSegment = 'full' | 'half' | 'empty';

export function resolveRatingSegments({
  value,
  max,
}: {
  value: number;
  max: number;
}): RatingSegment[] {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return [];
  }

  const clamped = Math.max(0, Math.min(value, max));
  const halfSteps = Math.round(clamped * 2);
  const segments: RatingSegment[] = [];

  for (let index = 0; index < max; index += 1) {
    const threshold = (index + 1) * 2;
    if (halfSteps >= threshold) {
      segments.push('full');
      continue;
    }

    if (halfSteps === threshold - 1) {
      segments.push('half');
      continue;
    }

    segments.push('empty');
  }

  return segments;
}
