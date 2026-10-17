import type {
  GridRectItem,
  GridViewport,
  GridViewportConstraints,
  GridZoomLimits,
} from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';

/** The renderer owns presentation only; world geometry comes from grid-view. */
export interface GridViewProps extends ZoraBaseProps {
  items: readonly GridRectItem[];
  contentWidth: number;
  contentHeight: number;
  width: number;
  height: number;
  /**
   * Canonical controlled world viewport. Supplying this value makes `onViewportChange`
   * report interaction proposals without mutating renderer-owned state.
   */
  viewport?: GridViewport;
  /** Initial world position and independent axis scales for uncontrolled rendering. */
  defaultViewport?: Partial<
    Pick<GridViewport, 'offsetX' | 'offsetY' | 'pixelsPerUnitX' | 'pixelsPerUnitY'>
  >;
  /** Finite world bounds and optional overscroll for panning and focused-item reveal. */
  viewportConstraints?: GridViewportConstraints;
  /** Independent X/Y scale limits applied to focal-point zoom interactions. */
  zoomLimits?: GridZoomLimits;
  /** @deprecated Use `defaultViewport` for new code. */
  zoom?: number;
  overscanPixels?: number;
  /** Stable item identity that must be scrolled into view without duplicating viewport geometry. */
  focusedItemId?: string;
  /** Pixel inset retained around a revealed focused item. */
  revealPaddingPixels?: number;
  onViewportChange?: (viewport: GridViewport) => void;
  onVisibleItemIdsChange?: (ids: readonly string[]) => void;
  renderItem: (item: GridRectItem) => React.ReactNode;
}

/** An item needs a stable ID; visual positioning belongs to the TileGrid composition. */
export interface TileGridItem {
  readonly id: string;
}

/** Reusable tile presentation based on the generic world/viewport engine. */
export interface TileGridProps extends ZoraBaseProps {
  items: readonly TileGridItem[];
  width?: number;
  height?: number;
  tileSize?: number;
  gap?: number;
  zoom?: number;
  viewport?: GridViewport;
  defaultViewport?: Partial<
    Pick<GridViewport, 'offsetX' | 'offsetY' | 'pixelsPerUnitX' | 'pixelsPerUnitY'>
  >;
  viewportConstraints?: GridViewportConstraints;
  zoomLimits?: GridZoomLimits;
  overscanPixels?: number;
  focusedItemId?: string;
  revealPaddingPixels?: number;
  /** Reports the same measured column count used to position tiles. */
  onColumnsChange?: (columns: number) => void;
  onViewportChange?: (viewport: GridViewport) => void;
  onVisibleItemIdsChange?: (ids: readonly string[]) => void;
  renderItem: (item: TileGridItem) => React.ReactNode;
}

/** The two independent native scroll axes that back a GridView viewport. */
export type GridScrollAxis = 'x' | 'y';

/** A physical native scroll position in pixels. */
export interface GridScrollPosition {
  readonly x: number;
  readonly y: number;
}

/** A programmatic native scroll request that GridView is still waiting to observe. */
export interface GridPendingScroll {
  readonly animated: boolean;
  readonly expiresAt: number;
  readonly target: number;
}

/** Native capabilities and clock used by the programmatic-versus-user scroll arbiter. */
export interface GridScrollSyncOptions {
  /** Requests a native scroll of one axis. */
  readonly scrollTo: (axis: GridScrollAxis, offset: number, animated: boolean) => void;
  /** Reports a genuine user scroll as the pixel displacement of the native offset. */
  readonly onUserScroll: (axis: GridScrollAxis, displacement: number) => void;
  /** Reconciles a late programmatic native frame without classifying it as a user pan. */
  readonly onProgrammaticScroll: (axis: GridScrollAxis, displacement: number) => void;
  readonly now?: () => number;
  readonly schedule?: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  readonly cancel?: (handle: ReturnType<typeof setTimeout>) => void;
}

/** Separates echoes of programmatic scrolls from user scrolling, independently per axis. */
export interface GridScrollSync {
  /** True when the baseline already matches the position within native tolerance. */
  readonly isCurrent: (position: GridScrollPosition) => boolean;
  /** Moves native scrolling to a viewport-derived position. */
  readonly request: (position: GridScrollPosition, animated: boolean) => void;
  /** Routes one native scroll event. */
  readonly scrolled: (axis: GridScrollAxis, offset: number) => void;
  /** Hands an axis to the user, adopting the native offset at the start of their drag. */
  readonly dragBegan: (axis: GridScrollAxis, offset: number) => void;
  /** Adopts the final native offset when a programmatic or momentum scroll ends. */
  readonly scrollEnded: (axis: GridScrollAxis, offset: number) => void;
  /** Cancels every pending settle timer. */
  readonly dispose: () => void;
}
