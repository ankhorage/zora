import type { GridLaneIntervalPlacement } from '@ankhorage/grid-view';

/*** Resolves a neighboring interval for keyboard movement without attaching domain meaning to lanes. */
export function resolveTimeGridNextFocusId(
  placements: readonly GridLaneIntervalPlacement[],
  focusedId: string,
  direction: 'down' | 'left' | 'right' | 'up',
): string | undefined {
  const focused = placements.find((placement) => placement.id === focusedId);
  if (!focused) return undefined;
  const candidates = placements.filter((placement) => {
    if (direction === 'left') return placement.laneId === focused.laneId && placement.x < focused.x;
    if (direction === 'right')
      return placement.laneId === focused.laneId && placement.x > focused.x;
    if (direction === 'up') return placement.laneIndex < focused.laneIndex;
    return placement.laneIndex > focused.laneIndex;
  });
  return candidates
    .sort(
      (first, second) =>
        resolveFocusDistance(first, focused, direction) -
        resolveFocusDistance(second, focused, direction),
    )
    .at(0)?.id;
}

/*** Measures nearby candidates by axis first and timeline/lane offset second. */
function resolveFocusDistance(
  candidate: GridLaneIntervalPlacement,
  focused: GridLaneIntervalPlacement,
  direction: 'down' | 'left' | 'right' | 'up',
): number {
  const horizontal = direction === 'left' || direction === 'right';
  const primary = horizontal
    ? Math.abs(candidate.x - focused.x)
    : Math.abs(candidate.laneIndex - focused.laneIndex);
  const secondary = horizontal
    ? Math.abs(candidate.laneIndex - focused.laneIndex)
    : Math.abs(candidate.x - focused.x);
  return primary * 1_000_000 + secondary;
}
