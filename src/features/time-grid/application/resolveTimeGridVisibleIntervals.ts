import { getVisibleLaneIntervals, type GridViewport } from '@ankhorage/grid-view';

import type { TimeGridInterval, TimeGridLane } from '../../../types/time-grid';

/*** Resolves the ordered interval placements visible in both world-space axes. */
export function resolveTimeGridVisibleIntervals(
  lanes: readonly TimeGridLane[],
  intervals: readonly TimeGridInterval[],
  viewport: GridViewport,
  overscanPixels?: number,
) {
  return getVisibleLaneIntervals(lanes, intervals, viewport, overscanPixels);
}
