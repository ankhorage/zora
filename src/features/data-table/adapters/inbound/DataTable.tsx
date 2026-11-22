import type { InteractionPolicy } from '@ankhorage/surface';
import { Show } from '@ankhorage/surface';
import React from 'react';
import { Linking, Pressable, ScrollView, type ViewStyle } from 'react-native';

import type {
  DataTableCellContext,
  DataTableCellSpec,
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
import { Image } from '../../../image/public';
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

/** Reads a manifest cell field without accepting executable accessor behavior. */
function resolveCellField<TRow extends object>(row: TRow, field: keyof TRow): unknown {
  return row[field];
}

/** Resolves a row value into a string suitable for portable text and URL presentation. */
function resolveCellString(value: unknown): string | undefined {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

/** Opens a portable website cell through React Native's platform URL boundary. */
function openExternalUrl(url: string): void {
  void Linking.openURL(url);
}

/** Renders one serializable manifest cell specification with canonical ZORA primitives. */
function renderPortableCell<TRow extends object>(
  cell: DataTableCellSpec<TRow>,
  row: TRow,
): React.ReactNode {
  switch (cell.kind) {
    case 'image': {
      const source = resolveCellString(resolveCellField(row, cell.source));
      const alt = resolveCellString(resolveCellField(row, cell.alt ?? cell.source));
      return <Image alt={alt} height={32} radius="s" source={source} width={32} />;
    }
    case 'text':
      return (
        <Text variant="bodySmall" weight={cell.weight}>
          {renderDefaultCell(resolveCellField(row, cell.value))}
        </Text>
      );
    case 'link': {
      const href = resolveCellString(resolveCellField(row, cell.href));
      const label = resolveCellString(resolveCellField(row, cell.label ?? cell.href)) ?? href;
      return href ? (
        <Pressable accessibilityRole="link" onPress={() => openExternalUrl(href)}>
          <Text color="primary" variant="bodySmall" weight="medium">
            {label}
          </Text>
        </Pressable>
      ) : (
        <Text variant="bodySmall">—</Text>
      );
    }
    case 'company': {
      const logo = resolveCellString(resolveCellField(row, cell.logo));
      const name = resolveCellString(resolveCellField(row, cell.name));
      const website = resolveCellString(resolveCellField(row, cell.website));
      const logoAlt = resolveCellString(resolveCellField(row, cell.logoAlt ?? cell.name));
      return (
        <View align="center" direction="row" gap="s">
          <Image alt={logoAlt} height={32} radius="s" source={logo} width={32} />
          <View gap="xxs">
            <Text variant="bodySmall" weight="bold">
              {name ?? '—'}
            </Text>
            {website ? (
              <Pressable accessibilityRole="link" onPress={() => openExternalUrl(website)}>
                <Text color="primary" variant="caption" weight="medium">
                  {website}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      );
    }
  }
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
  if (column.renderCell) return column.renderCell(context);
  if (column.cell) return renderPortableCell(column.cell, row);
  return renderDefaultCell(context.value);
}

function renderTableCell<TRow extends object>(
  column: DataTableColumn<TRow>,
  row: TRow,
  rowIndex: number,
) {
  if (column.renderCell) return column.renderCell(createCellContext(column, row, rowIndex));
  if (column.cell) return renderPortableCell(column.cell, row);

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

/** Emits both the established controlled callback and its portable manifest event counterpart. */
function emitSelectionChange<TRow extends object>(
  selectedRowIds: readonly string[],
  onSelectedRowIdsChange: DataTableProps<TRow>['onSelectedRowIdsChange'],
  onSelectionChange: DataTableProps<TRow>['onSelectionChange'],
): void {
  onSelectedRowIdsChange?.(selectedRowIds);
  onSelectionChange?.({ selectedRowIds });
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
  onSelectionChange,
  onRowActivate,
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
  const selectionDisabled =
    interactionPolicy === 'passive' ||
    (onSelectedRowIdsChange === undefined && onSelectionChange === undefined);
  const hasRowActions = rows.some((row, rowIndex) => (rowActions?.(row, rowIndex).length ?? 0) > 0);
  const selection = selectionEnabled
    ? {
        allVisibleSelected: rowIds.every((currentRowId) => selectedRowIdSet.has(currentRowId)),
        disabled: selectionDisabled,
        onAllVisibleSelectedChange: (selected: boolean) => {
          if (selectionDisabled) return;
          emitSelectionChange(
            resolveNextVisibleSelection(controlledSelectedRowIds, rowIds, selected),
            onSelectedRowIdsChange,
            onSelectionChange,
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
                            emitSelectionChange(
                              resolveNextSelectedRowIds(
                                controlledSelectedRowIds,
                                currentRowId,
                                nextSelected,
                              ),
                              onSelectedRowIdsChange,
                              onSelectionChange,
                            );
                          }}
                        />
                      </View>
                    ) : null}
                    <View direction="row" style={{ flexGrow: 1, flexShrink: 1 }}>
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
                    </View>
                    {onRowActivate ? (
                      <IconButton
                        icon={{ name: 'arrow-forward' }}
                        interactionPolicy={interactionPolicy}
                        label={`Activate row ${currentRowId}`}
                        onPress={() => onRowActivate({ rowId: currentRowId })}
                        size="s"
                        variant="ghost"
                      />
                    ) : null}
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
  selectedRowIds,
  onSelectedRowIdsChange,
  onSelectionChange,
  onRowActivate,
  testID,
  interactionPolicy,
}: DataTableProps<TRow>) {
  const [primaryColumn, ...detailColumns] = columns;
  const controlledSelectedRowIds = selectedRowIds ?? [];
  const selectedRowIdSet = new Set(controlledSelectedRowIds);
  const selectionEnabled = selectedRowIds !== undefined;
  const selectionDisabled =
    interactionPolicy === 'passive' ||
    (onSelectedRowIdsChange === undefined && onSelectionChange === undefined);

  return (
    <View gap="s">
      {rows.map((row, rowIndex) => {
        const currentRowId = resolveDataTableRowKey(row, rowIndex, rowKey, rowId);
        const title = primaryColumn
          ? renderCell(primaryColumn, row, rowIndex)
          : `Row ${rowIndex + 1}`;
        const actions = renderRowActions({ row, rowActions, rowIndex, testID, interactionPolicy });
        const rowActivation = onRowActivate ? (
          <IconButton
            icon={{ name: 'arrow-forward' }}
            interactionPolicy={interactionPolicy}
            label={`Activate row ${currentRowId}`}
            onPress={() => onRowActivate({ rowId: currentRowId })}
            size="s"
            variant="ghost"
          />
        ) : null;

        return (
          <Card
            actions={
              rowActivation || actions ? (
                <View direction="row" gap="xs">
                  {rowActivation}
                  {actions}
                </View>
              ) : null
            }
            compact
            interactionPolicy={interactionPolicy}
            key={currentRowId}
            testID={testID ? `${testID}-card-${rowIndex}` : undefined}
            title={title}
          >
            <View gap="s">
              {selectionEnabled ? (
                <Checkbox
                  accessibilityLabel={`Select row ${currentRowId}`}
                  checked={selectedRowIdSet.has(currentRowId)}
                  disabled={selectionDisabled}
                  interactionPolicy={interactionPolicy}
                  onCheckedChange={(nextSelected) => {
                    if (selectionDisabled) return;
                    emitSelectionChange(
                      resolveNextSelectedRowIds(
                        controlledSelectedRowIds,
                        currentRowId,
                        nextSelected,
                      ),
                      onSelectedRowIdsChange,
                      onSelectionChange,
                    );
                  }}
                />
              ) : null}
              {detailColumns.map((column) => (
                <View gap="xxs" key={column.id}>
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {column.header}
                  </Text>
                  {column.renderCell || column.cell ? (
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
