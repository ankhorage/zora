import type { InteractionPolicy } from '@ankhorage/surface';
import { Show } from '@ankhorage/surface';
import React from 'react';
import { ScrollView, type ViewStyle } from 'react-native';

import type {
  DataTableCellContext,
  DataTableColumn,
  DataTableColumnAlign,
  DataTableDensity,
  DataTableProps,
  DataTableRowAction,
  DataTableSortDirection,
} from '../../../../types/data-table';
import { Button } from '../../../button/public';
import { IconButton } from '../../../button/public';
import { Card } from '../../../card/public';
import { EmptyState } from '../../../empty-state/public';
import { Checkbox } from '../../../form/checkbox/public';
import { View } from '../../../layout/public';
import { PopoverMenu, type PopoverMenuAction } from '../../../popover-menu/public';
import { SkeletonList } from '../../../skeleton/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Text, type TextAlign } from '../../../typography/public';
import { resolveDataTableRowKey } from '../../utils/resolveDataTableRowKey';
/***
 * Displays structured tabular data with responsive columns and optional controlled row selection.
 */
export const DataTable = withZoraThemeScope(DataTableInner);

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
    flexShrink: column.width === undefined && column.minWidth === undefined ? 1 : 0,
    minWidth: column.minWidth,
    width: column.width,
  };
}

/*** Resolves the compact, fixed width reserved for the optional selection control. */
function resolveSelectionColumnStyle(): ViewStyle {
  return { alignItems: 'center', flexShrink: 0, width: 40 };
}

function resolveRowPadding(density: DataTableDensity) {
  return density === 'compact'
    ? { px: 'm' as const, py: 's' as const }
    : { px: 'm' as const, py: 'm' as const };
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

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return '—';
}

function createCellContext<TRow extends object>(
  column: DataTableColumn<TRow>,
  row: TRow,
  rowIndex: number,
): DataTableCellContext<TRow> {
  return {
    column,
    row,
    rowIndex,
    value: resolveAccessorValue(row, column),
  };
}

function renderCell<TRow extends object>(
  column: DataTableColumn<TRow>,
  row: TRow,
  rowIndex: number,
) {
  const context = createCellContext(column, row, rowIndex);
  return column.renderCell ? column.renderCell(context) : renderDefaultCell(context.value);
}

function renderTableCell<TRow extends object>(
  column: DataTableColumn<TRow>,
  row: TRow,
  rowIndex: number,
) {
  if (column.renderCell) {
    return column.renderCell(createCellContext(column, row, rowIndex));
  }

  return (
    <Text align={resolveTextAlign(column.align)} variant="bodySmall">
      {renderDefaultCell(resolveAccessorValue(row, column))}
    </Text>
  );
}

function resolveNextSortDirection(
  current: DataTableSortDirection | undefined,
): DataTableSortDirection {
  return current === 'asc' ? 'desc' : 'asc';
}

/*** Applies a single row checkbox change to controlled DataTable selection. */
function resolveNextSelectedRowIds(
  selectedRowIds: readonly string[],
  rowId: string,
  selected: boolean,
): readonly string[] {
  return selected
    ? [...new Set([...selectedRowIds, rowId])]
    : selectedRowIds.filter((selectedRowId) => selectedRowId !== rowId);
}

/*** Applies the header checkbox change to the currently visible DataTable rows. */
function resolveNextVisibleSelection(
  selectedRowIds: readonly string[],
  visibleRowIds: readonly string[],
  selected: boolean,
): readonly string[] {
  const visibleRowIdSet = new Set(visibleRowIds);
  return selected
    ? [...new Set([...selectedRowIds, ...visibleRowIds])]
    : selectedRowIds.filter((selectedRowId) => !visibleRowIdSet.has(selectedRowId));
}

/*** Maps row-scoped DataTable actions into the shared PopoverMenu action contract. */
function mapRowActions<TRow extends object>(
  row: TRow,
  actions: readonly DataTableRowAction<TRow>[],
): readonly PopoverMenuAction[] {
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

/*** Renders the row action trigger and anchored PopoverMenu when actions exist. */
function renderRowActions<TRow extends object>({
  row,
  rowIndex,
  rowActions,
  testID,
  interactionPolicy,
}: {
  row: TRow;
  rowIndex: number;
  rowActions: DataTableProps<TRow>['rowActions'];
  testID?: string;
  interactionPolicy?: InteractionPolicy;
}): React.ReactNode {
  const actions = rowActions?.(row, rowIndex) ?? [];

  if (actions.length === 0) {
    return null;
  }

  return (
    <PopoverMenu
      actions={mapRowActions(row, actions)}
      interactionPolicy={interactionPolicy}
      testID={testID ? `${testID}-row-actions-${rowIndex}` : undefined}
      trigger={({ toggle }) => (
        <IconButton
          icon={{ name: 'ellipsis-horizontal' }}
          interactionPolicy={interactionPolicy}
          label="Row actions"
          onPress={toggle}
          size="s"
          variant="ghost"
        />
      )}
    />
  );
}

function DataTableHeader<TRow extends object>({
  columns,
  sort,
  onSortChange,
  density,
  interactionPolicy,
  selection,
  hasRowActions,
}: Pick<DataTableProps<TRow>, 'columns' | 'density' | 'onSortChange' | 'sort'> & {
  interactionPolicy?: InteractionPolicy;
  selection?: {
    allVisibleSelected: boolean;
    disabled: boolean;
    onAllVisibleSelectedChange: (selected: boolean) => void;
  };
  hasRowActions: boolean;
}) {
  const padding = resolveRowPadding(density ?? 'comfortable');
  const passive = interactionPolicy === 'passive';

  return (
    <View bg="subtle" borderColor="border" borderWidth={1} radius="m">
      <View direction="row" align="center">
        {selection ? (
          <View px={padding.px} py={padding.py} style={resolveSelectionColumnStyle()}>
            <Checkbox
              accessibilityLabel="Select all visible rows"
              checked={selection.allVisibleSelected}
              disabled={selection.disabled}
              interactionPolicy={interactionPolicy}
              onCheckedChange={selection.onAllVisibleSelectedChange}
            />
          </View>
        ) : null}
        {columns.map((column) => {
          const currentDirection = sort?.columnId === column.id ? sort.direction : undefined;
          const sortable = Boolean(column.sortable && onSortChange);
          const directionLabel =
            currentDirection === undefined ? '' : currentDirection === 'asc' ? ' ↑' : ' ↓';

          return (
            <View key={column.id} px={padding.px} py={padding.py} style={resolveCellStyle(column)}>
              {sortable ? (
                <Button
                  color="primary"
                  interactionPolicy={interactionPolicy}
                  onPress={() => {
                    if (passive) return;

                    onSortChange?.({
                      columnId: column.id,
                      direction: resolveNextSortDirection(currentDirection),
                    });
                  }}
                  size="s"
                  variant="ghost"
                >
                  {column.header}
                  {directionLabel}
                </Button>
              ) : (
                <Text
                  align={resolveTextAlign(column.align)}
                  emphasis="muted"
                  variant="caption"
                  weight="semiBold"
                >
                  {column.header}
                </Text>
              )}
            </View>
          );
        })}
        {hasRowActions ? (
          <View px={padding.px} py={padding.py} style={{ minWidth: 56, width: 56 }}>
            <Text align="right" emphasis="muted" variant="caption" weight="semiBold">
              Actions
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function DataTableDesktop<TRow extends object>({
  columns,
  rows,
  rowActions,
  rowId,
  rowKey,
  selectedRowIds,
  onSelectedRowIdsChange,
  sort,
  onSortChange,
  density,
  testID,
  interactionPolicy,
}: DataTableProps<TRow>) {
  const padding = resolveRowPadding(density ?? 'comfortable');
  const rowIds = rows.map((row, rowIndex) => resolveDataTableRowKey(row, rowIndex, rowKey, rowId));
  const controlledSelectedRowIds = selectedRowIds ?? [];
  const selectedRowIdSet = new Set(controlledSelectedRowIds);
  const selectionEnabled = selectedRowIds !== undefined;
  const selectionDisabled = interactionPolicy === 'passive' || onSelectedRowIdsChange === undefined;
  const hasRowActions = rows.some((row, rowIndex) => (rowActions?.(row, rowIndex).length ?? 0) > 0);
  const selection = selectionEnabled
    ? {
        allVisibleSelected: rowIds.every((currentRowId) => selectedRowIdSet.has(currentRowId)),
        disabled: selectionDisabled,
        onAllVisibleSelectedChange: (selected: boolean) => {
          if (selectionDisabled) return;
          onSelectedRowIdsChange(
            resolveNextVisibleSelection(controlledSelectedRowIds, rowIds, selected),
          );
        },
      }
    : undefined;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ width: '100%' }}>
        <View gap="xs">
          <DataTableHeader
            columns={columns}
            density={density}
            hasRowActions={hasRowActions}
            interactionPolicy={interactionPolicy}
            onSortChange={onSortChange}
            selection={selection}
            sort={sort}
          />
          <View gap="xs">
            {rows.map((row, rowIndex) => {
              const currentRowId = resolveDataTableRowKey(row, rowIndex, rowKey, rowId);
              const selected = selectedRowIdSet.has(currentRowId);

              return (
                <View
                  bg="surface"
                  borderColor="border"
                  borderWidth={1}
                  key={currentRowId}
                  radius="m"
                  testID={testID ? `${testID}-row-${rowIndex}` : undefined}
                >
                  <View direction="row" align="center">
                    {selectionEnabled ? (
                      <View px={padding.px} py={padding.py} style={resolveSelectionColumnStyle()}>
                        <Checkbox
                          accessibilityLabel={`Select row ${currentRowId}`}
                          checked={selected}
                          disabled={selectionDisabled}
                          interactionPolicy={interactionPolicy}
                          onCheckedChange={(nextSelected) => {
                            if (selectionDisabled) return;
                            onSelectedRowIdsChange(
                              resolveNextSelectedRowIds(
                                controlledSelectedRowIds,
                                currentRowId,
                                nextSelected,
                              ),
                            );
                          }}
                        />
                      </View>
                    ) : null}
                    {columns.map((column) => (
                      <View
                        key={column.id}
                        px={padding.px}
                        py={padding.py}
                        style={resolveCellStyle(column)}
                      >
                        {renderTableCell(column, row, rowIndex)}
                      </View>
                    ))}
                    {hasRowActions ? (
                      <View
                        px={padding.px}
                        py={padding.py}
                        style={{ alignItems: 'flex-end', minWidth: 56, width: 56 }}
                      >
                        {renderRowActions({ row, rowActions, rowIndex, testID, interactionPolicy })}
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function DataTableMobile<TRow extends object>({
  columns,
  rows,
  rowActions,
  rowId,
  rowKey,
  testID,
  interactionPolicy,
}: DataTableProps<TRow>) {
  const [primaryColumn, ...detailColumns] = columns;

  return (
    <View gap="s">
      {rows.map((row, rowIndex) => {
        const title = primaryColumn
          ? renderCell(primaryColumn, row, rowIndex)
          : `Row ${rowIndex + 1}`;
        const actions = renderRowActions({ row, rowActions, rowIndex, testID, interactionPolicy });

        return (
          <Card
            actions={actions}
            compact
            interactionPolicy={interactionPolicy}
            key={resolveDataTableRowKey(row, rowIndex, rowKey, rowId)}
            testID={testID ? `${testID}-card-${rowIndex}` : undefined}
            title={title}
          >
            <View gap="s">
              {detailColumns.map((column) => (
                <View gap="xxs" key={column.id}>
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {column.header}
                  </Text>
                  {column.renderCell ? (
                    renderCell(column, row, rowIndex)
                  ) : (
                    <Text variant="bodySmall">
                      {renderDefaultCell(resolveAccessorValue(row, column))}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </Card>
        );
      })}
    </View>
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
  interactionPolicy,
  ...props
}: DataTableProps<TRow>) {
  if (loading) {
    return <SkeletonList rows={loadingRows} variant="card" testID={testID} />;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const tableProps: DataTableProps<TRow> = {
    ...props,
    density,
    emptyDescription,
    emptyTitle,
    interactionPolicy,
    loading,
    loadingRows,
    rows,
    testID,
  };

  return (
    <View testID={testID}>
      <Show when={{ base: false, md: true }} fallback={<DataTableMobile {...tableProps} />}>
        <DataTableDesktop {...tableProps} />
      </Show>
    </View>
  );
}
