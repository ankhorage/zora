import type {
  GridMatrixCell,
  GridMatrixCellPlacement,
  GridMatrixLayout,
  GridViewport,
} from '@ankhorage/grid-view';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { SelectionMode } from './selection';

/** Code-first virtualized sparse-matrix presentation over the published grid-view geometry API. */
export interface MatrixGridProps extends ZoraBaseProps {
  readonly layout: GridMatrixLayout;
  readonly cells: readonly GridMatrixCell[];
  readonly width: number;
  readonly height: number;
  /** A supplied viewport is controlled by the caller, including independent axis zoom. */
  readonly viewport?: GridViewport;
  readonly zoomX?: number;
  readonly zoomY?: number;
  readonly overscanPixels?: number;
  /** Retains focus navigation while suppressing cell-selection mutations. */
  readonly readOnly?: boolean;
  readonly selectedCellIds?: readonly string[];
  readonly selectionMode?: SelectionMode;
  readonly onSelectionChange?: (ids: readonly string[]) => void;
  readonly onViewportChange?: (viewport: GridViewport) => void;
  readonly renderCell: (cell: GridMatrixCellPlacement) => React.ReactNode;
  readonly accessibilityLabel?: string;
}
