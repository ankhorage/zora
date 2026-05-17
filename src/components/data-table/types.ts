import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { MenuActionIntent } from '../menu';

export type DataTableColumnAlign = 'start' | 'center' | 'end';
export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableSortState {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableCellContext<TRow extends object> {
  row: TRow;
  rowIndex: number;
  column: DataTableColumn<TRow>;
  value: unknown;
}

export interface DataTableColumn<TRow extends object> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof TRow;
  align?: DataTableColumnAlign;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  renderCell?: (context: DataTableCellContext<TRow>) => React.ReactNode;
}

export interface DataTableRowAction<TRow extends object> {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  intent?: MenuActionIntent;
  disabled?: boolean;
  onPress?: (row: TRow) => void;
}

export interface DataTableProps<TRow extends object> extends ZoraBaseProps {
  columns: readonly DataTableColumn<TRow>[];
  rows: readonly TRow[];
  rowId: (row: TRow, index: number) => string;
  rowActions?: (row: TRow, index: number) => readonly DataTableRowAction<TRow>[];
  sort?: DataTableSortState;
  onSortChange?: (sort: DataTableSortState) => void;
  loading?: boolean;
  loadingRows?: number;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  density?: DataTableDensity;
  testID?: string;
}
