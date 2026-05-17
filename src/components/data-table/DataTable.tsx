import React from 'react';
import { ScrollView, type ViewStyle } from 'react-native';

import { Card } from '../card';
import { IconButton } from '../icon-button';
import { DropdownMenu, type MenuAction } from '../menu';
import { SkeletonList } from '../skeleton';
import { Text, type TextAlign } from '../text';
import { Box, Show, Stack } from '../../foundation';
import { EmptyState } from '../../patterns/empty-state';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type {
  DataTableCellContext,
  DataTableColumn,
  DataTableColumnAlign,
  DataTableProps,
  DataTableRowAction,
  DataTableSortDirection,
} from './types';

function resolveTextAlign(align: DataTableColumnAlign | undefined): TextAlign {
  switch (align) {
    case 'center':
      return 'center';
    case 'end':
      return 'right';
    case 'start':
    default:
      return 'left';
  }
}

function resolveCellJustify(align: DataTableColumnAlign | undefined): ViewStyle['alignItems'] {
  switch (align) {
    case 'center':
      return 'center';
    case 'end':
      return 'flex-end';
    case 'start':
    default:
      return 'flex-start';
  }
}

function resolveCellStyle<TRow extends object>(column: DataTableColumn<TRow>): ViewStyle {
  return {
    alignItems: resolveCellJustify(column.align),
    flexGrow: column.width === undefined ? 1 : 0,
    flexShrink: 0,
    minWidth: column.minWidth ?? 140,
    width: column.width,
  };
}

function resolveRowPadding(density: NonNullable<DataTableProps<object>['density']>) {
  return density === 'compact' ? { px: 'm' as const, py: 's' as const } : { px: 'm' as const, py: 'm' as const };
}

function resolveAccessorValue<TRow extends object>(row: TRow, column: DataTableColumn<TRow>) {
  if (column.accessor === undefined) {
    return undefined;
  }

  return row[column.accessor];
}

function renderDefaultCell(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
}

function renderCell<TRow extends object>(
  column: DataTableColumn<TRow>,
  row: TRow,
  rowIndex: number,
) {
  const value = resolveAccessorValue(row, column);
  const context: DataTableCellContext<TRow> = {
    column,
    row,
    rowIndex,
    value,
  };

  return column.renderCell ? column.renderCell(context) : renderDefaultCell(value);
}

function resolveNextSortDirection(
  current: DataTableSortDirection | undefined,
): DataTableSortDirection {
  return current === 'asc' ? 'desc' : 'asc';
}

function mapRowActions<TRow extends object>(
  row: TRow,
  actions: readonly DataTableRowAction<TRow>[],
): readonly MenuAction[] {
  return actions.map((action) => ({
    description: action.description,
    disabled: action.disabled,
    icon: action.icon,
    id: action.id,
    intent: action.intent,
    onPress: action.onPress ? () => action.onPress?.(row) : undefined,
    title: action.title,
  }));
}

function renderRowActions<TRow extends object>({
  row,
  rowIndex,
  rowActions,
  testID,
}: {
  row: TRow;
  rowIndex: number;
  rowActions: DataTableProps<TRow>['rowActions'];
  testID?: string;
}) {
  const actions = rowActions?.(row, rowIndex) ?? [];

  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu
      actions={mapRowActions(row, actions)}
      trigger={
        <IconButton
          icon={{ name: 'ellipsis-horizontal' }}
          label="Row actions"
          size="s"
          variant="ghost"
        />
      }
      testID={testID ? `${testID}-row-actions-${rowIndex}` : undefined}
    />
  );
}

function DataTableHeader<TRow extends object>({
  columns,
  sort,
  onSortChange,
  density,
}: Pick<DataTableProps<TRow>, 'columns' | 'density' | 'onSortChange' | 'sort'>) {
  const padding = resolveRowPadding(density ?? 'comfortable');

  return (
    <Box bg="subtle" borderColor="border" borderWidth={1} radius="m">
      <Stack direction="row" align="center">
        {columns.map((column) => {
          const currentDirection = sort?.columnId === column.id ? sort.direction : undefined;
          const sortable = Boolean(column.sortable && onSortChange);
          const label = currentDirection ? `${column.header} ${currentDirection === 'asc' ? '↑' : '↓'}` : column.header;

          return (
            <Box key={column.id} px={padding.px} py={padding.py} style={resolveCellStyle(column)}>
              {sortable ? (
                <Text
                  accessibilityRole="button"
                  align={resolveTextAlign(column.align)}
                  color="primary"
                  onPress={() =>
                    onSortChange?.({
                      columnId: column.id,
                      direction: resolveNextSortDirection(currentDirection),
                    })
                  }
                  variant="caption"
                  weight="semiBold"
                >
                  {label}
                </Text>
              ) : (
                <Text align={resolveTextAlign(column.align)} emphasis="muted" variant="caption" weight="semiBold">
                  {column.header}
                </Text>
              )}
            </Box>
          );
        })}
        <Box px={padding.px} py={padding.py} style={{ minWidth: 56, width: 56 }}>
          <Text align="right" emphasis="muted" variant="caption" weight="semiBold">
            Actions
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

function DataTableDesktop<TRow extends object>({
  columns,
  rows,
  rowActions,
  rowId,
  sort,
  onSortChange,
  density,
  testID,
}: DataTableProps<TRow>) {
  const padding = resolveRowPadding(density ?? 'comfortable');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Box minWidth={720} style={{ width: '100%' }}>
        <Stack gap="xs">
          <DataTableHeader columns={columns} density={density} onSortChange={onSortChange} sort={sort} />
          <Stack gap="xs">
            {rows.map((row, rowIndex) => (
              <Box
                bg="surface"
                borderColor="border"
                borderWidth={1}
                key={rowId(row, rowIndex)}
                radius="m"
                testID={testID ? `${testID}-row-${rowIndex}` : undefined}
              >
                <Stack direction="row" align="center">
                  {columns.map((column) => (
                    <Box key={column.id} px={padding.px} py={padding.py} style={resolveCellStyle(column)}>
                      <Text align={resolveTextAlign(column.align)} variant="bodySmall">
                        {renderCell(column, row, rowIndex)}
                      </Text>
                    </Box>
                  ))}
                  <Box px={padding.px} py={padding.py} style={{ alignItems: 'flex-end', minWidth: 56, width: 56 }}>
                    {renderRowActions({ row, rowActions, rowIndex, testID })}
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </ScrollView>
  );
}

function DataTableMobile<TRow extends object>({
  columns,
  rows,
  rowActions,
  rowId,
  testID,
}: DataTableProps<TRow>) {
  const [primaryColumn, ...detailColumns] = columns;

  return (
    <Stack gap="s">
      {rows.map((row, rowIndex) => {
        const title = primaryColumn ? renderCell(primaryColumn, row, rowIndex) : `Row ${rowIndex + 1}`;
        const actions = renderRowActions({ row, rowActions, rowIndex, testID });

        return (
          <Card
            actions={actions}
            compact
            key={rowId(row, rowIndex)}
            testID={testID ? `${testID}-card-${rowIndex}` : undefined}
            title={title}
          >
            <Stack gap="s">
              {detailColumns.map((column) => (
                <Stack gap="xxs" key={column.id}>
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {column.header}
                  </Text>
                  <Text variant="bodySmall">{renderCell(column, row, rowIndex)}</Text>
                </Stack>
              ))}
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

function DataTableInner<TRow extends object>({
  themeId: _themeId,
  mode: _mode,
  rows,
  loading = false,
  loadingRows = 5,
  emptyTitle = 'No data',
  emptyDescription = 'There are no rows to display.',
  testID,
  density = 'comfortable',
  ...props
}: DataTableProps<TRow>) {
  if (loading) {
    return <SkeletonList rows={loadingRows} variant="card" testID={testID} />;
  }

  if (rows.length === 0) {
    return <EmptyState compact title={emptyTitle} description={emptyDescription} testID={testID} />;
  }

  const tableProps: DataTableProps<TRow> = {
    ...props,
    density,
    emptyDescription,
    emptyTitle,
    loading,
    loadingRows,
    rows,
    testID,
  };

  return (
    <Box testID={testID}>
      <Show when={{ base: false, md: true }} fallback={<DataTableMobile {...tableProps} />}>
        <DataTableDesktop {...tableProps} />
      </Show>
    </Box>
  );
}

export const DataTable = withZoraThemeScope(DataTableInner);
