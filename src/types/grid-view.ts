import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';

/** The renderer owns presentation only; world geometry comes from grid-view. */
export interface GridViewProps extends ZoraBaseProps {
  items: readonly GridRectItem[];
  contentWidth: number;
  contentHeight: number;
  width: number;
  height: number;
  zoom?: number;
  overscanPixels?: number;
  onViewportChange?: (viewport: GridViewport) => void;
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
  overscanPixels?: number;
  renderItem: (item: TileGridItem) => React.ReactNode;
}
