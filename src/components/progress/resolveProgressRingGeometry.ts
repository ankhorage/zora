export function resolveProgressRingGeometry({
  fraction,
  size,
  thickness,
}: {
  fraction: number;
  size: number;
  thickness: number;
}) {
  const diameter = normalizePositiveNumber(size, DEFAULT_SIZE, MINIMUM_SIZE);
  const strokeWidth = Math.min(
    normalizePositiveNumber(thickness, DEFAULT_THICKNESS, MINIMUM_THICKNESS),
    diameter / 2,
  );
  const centerlineRadius = (diameter - strokeWidth) / 2;
  const segmentCount = Math.max(
    MINIMUM_SEGMENT_COUNT,
    Math.min(MAXIMUM_SEGMENT_COUNT, Math.round(Math.PI * centerlineRadius)),
  );
  const normalizedFraction = Math.min(Math.max(Number.isFinite(fraction) ? fraction : 0, 0), 1);

  return {
    diameter,
    filledSegmentCount: Math.round(normalizedFraction * segmentCount),
    segmentCount,
    segmentWidth: Math.max(1, (2 * Math.PI * centerlineRadius) / segmentCount + 0.5),
    strokeWidth,
  };
}

const DEFAULT_SIZE = 120;
const DEFAULT_THICKNESS = 10;
const MAXIMUM_SEGMENT_COUNT = 120;
const MINIMUM_SEGMENT_COUNT = 32;
const MINIMUM_SIZE = 24;
const MINIMUM_THICKNESS = 1;

function normalizePositiveNumber(value: number, fallback: number, minimum: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.max(value, minimum);
}
