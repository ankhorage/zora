import type { GridLane, GridLaneInterval, GridViewport } from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';

/** An ordered, variable-height track rendered by the generic TimeGrid. */
export type TimeGridLane = GridLane;

/** A stable world-space interval rendered by the generic TimeGrid. */
export type TimeGridInterval = GridLaneInterval;

/**
 * Code API for virtualized interval lanes. Domain adapters map dates, PPQ ticks, and other units
 * to numeric world coordinates before reaching this boundary.
 */
export interface TimeGridProps extends ZoraBaseProps {
  readonly lanes: readonly TimeGridLane[];
  readonly intervals: readonly TimeGridInterval[];
  readonly contentWidth: number;
  readonly width: number;
  readonly height: number;
  readonly zoom?: number;
  readonly overscanPixels?: number;
  readonly focusedIntervalId?: string;
  readonly onFocusedIntervalIdChange?: (id: string) => void;
  readonly revealPaddingPixels?: number;
  readonly selectedIntervalIds?: readonly string[];
  readonly onIntervalPress?: (interval: TimeGridInterval) => void;
  readonly onViewportChange?: (viewport: GridViewport) => void;
  readonly onVisibleIntervalIdsChange?: (ids: readonly string[]) => void;
  readonly renderInterval: (interval: TimeGridInterval, selected: boolean) => React.ReactNode;
  readonly renderLaneLabel?: (lane: TimeGridLane) => React.ReactNode;
}
