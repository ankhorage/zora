import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';

/** A free-positioned item retains the grid-view world rectangle and adds presentation policy. */
export interface SpatialGridItem extends GridRectItem {
  /** Higher values are painted and hit-tested above lower values; equal values preserve input order. */
  readonly zIndex?: number;
  /** Accessible name for the item when its custom content has no own label. */
  readonly accessibilityLabel?: string;
  /** Prevents selection and activation for this item while keeping it visible. */
  readonly disabled?: boolean;
}

/** State supplied to the code-only item renderer. */
export interface SpatialGridItemState {
  readonly selected: boolean;
  readonly focused: boolean;
  readonly disabled: boolean;
}

/** Props for the virtualized, free-placement presentation over canonical GridView geometry. */
export interface SpatialGridProps extends ZoraBaseProps {
  readonly items: readonly SpatialGridItem[];
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly width: number;
  readonly height: number;
  readonly zoom?: number;
  readonly overscanPixels?: number;
  readonly selectedItemId?: string;
  readonly focusedItemId?: string;
  readonly revealPaddingPixels?: number;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly onSelectionChange?: (id: string) => void;
  readonly onActivation?: (id: string) => void;
  readonly onFocusChange?: (id: string) => void;
  readonly onViewportChange?: (viewport: GridViewport) => void;
  readonly onVisibleItemIdsChange?: (ids: readonly string[]) => void;
  readonly renderItem: (item: SpatialGridItem, state: SpatialGridItemState) => React.ReactNode;
}
