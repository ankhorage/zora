import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { PopoverMenuActionIntent } from './popover-menu';

export type DataTableColumnAlign = 'start' | 'center' | 'end';
export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableSortDirection = 'asc' | 'desc';

/** A portable reference to a string-valued row field used by a manifest cell. */
export type DataTableRowField<TRow extends object> = Extract<keyof TRow, string>;

/** Serializable image, text, link, and company presentations for a DataTable column. */
export type DataTableCellSpec<TRow extends object> =
  | {
      readonly kind: 'image';
      readonly source: DataTableRowField<TRow>;
      readonly alt?: DataTableRowField<TRow>;
    }
  | {
      readonly kind: 'text';
      readonly value: DataTableRowField<TRow>;
      readonly weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
    }
  | {
      readonly kind: 'link';
      readonly href: DataTableRowField<TRow>;
      readonly label?: DataTableRowField<TRow>;
    }
  | {
      readonly kind: 'company';
      readonly logo: DataTableRowField<TRow>;
      readonly name: DataTableRowField<TRow>;
      readonly website: DataTableRowField<TRow>;
      readonly logoAlt?: DataTableRowField<TRow>;
    };

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
  /** Portable manifest presentation. Takes precedence over the default accessor rendering. */
  cell?: DataTableCellSpec<TRow>;
  renderCell?: (context: DataTableCellContext<TRow>) => React.ReactNode;
}

export interface DataTableSelectionChangeEvent {
  readonly selectedRowIds: readonly string[];
}

export interface DataTableRowActivateEvent {
  readonly rowId: string;
}

export interface DataTableRowAction<TRow extends object> {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: ButtonIconSpec;
  intent?: PopoverMenuActionIntent;
  disabled?: boolean;
  onPress?: (row: TRow) => void;
}

export interface DataTableProps<TRow extends object> extends ZoraBaseProps {
  columns: readonly DataTableColumn<TRow>[];
  rows: readonly TRow[];
  rowId?: (row: TRow, index: number) => string;
  rowKey?: keyof TRow;
  /** Controlled identifiers for rows selected with the optional checkbox column. */
  selectedRowIds?: readonly string[];
  /** Receives the next controlled selection after a row or visible-row toggle. */
  onSelectedRowIdsChange?: (selectedRowIds: readonly string[]) => void;
  /** Emits the serializable controlled selection payload used by AppManifest events. */
  onSelectionChange?: (event: DataTableSelectionChangeEvent) => void;
  /** Emits a row activation independently of checkbox selection. */
  onRowActivate?: (event: DataTableRowActivateEvent) => void;
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
