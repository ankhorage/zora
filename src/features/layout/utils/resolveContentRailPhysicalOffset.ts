export function resolveContentRailPhysicalOffset({
  isRtl,
  logicalOffset,
  maxOffset,
}: {
  isRtl: boolean;
  logicalOffset: number;
  maxOffset: number;
}): number {
  const clampedOffset = Math.min(Math.max(0, logicalOffset), Math.max(0, maxOffset));
  return isRtl ? Math.max(0, maxOffset) - clampedOffset : clampedOffset;
}
