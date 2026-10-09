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
