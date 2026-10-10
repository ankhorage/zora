import {
  getVisibleMatrixCells,
  type GridMatrixCellPlacement,
  type GridViewport,
} from '@ankhorage/grid-view';
import { isRecord } from '@ankhorage/utility/object';
import React from 'react';
import { Platform, Pressable as NativePressable, StyleSheet, View } from 'react-native';

import type { MatrixGridProps } from '../../../../types/matrix-grid';
import { GridView } from '../../../grid-view/public';
import { resolveSelectionEventIntent } from '../../../selection/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveMatrixGridContentSize } from '../../application/resolveMatrixGridContentSize';
import { resolveMatrixGridSelection } from '../../application/resolveMatrixGridSelection';
import { MatrixGridKeyboardProxy } from './MatrixGridKeyboardProxy';
import { useMatrixGridKeyboardFocus } from './useMatrixGridKeyboardFocus';

/*** Compose the canonical GridView around released sparse matrix placement and culling geometry. */
function MatrixGridInner({
  accessibilityLabel = 'Matrix grid',
  cells,
  height,
  interactionPolicy,
  layout,
  onSelectionChange,
  onViewportChange,
  overscanPixels = 160,
  renderCell,
  selectedCellIds = [],
  selectionMode = 'single',
  testID,
  viewport: controlledViewport,
  width,
  zoomX = 1,
  zoomY = 1,
}: MatrixGridProps) {
  const { theme } = useZoraTheme();
  const contentSize = React.useMemo(() => resolveMatrixGridContentSize(layout), [layout]);
  const initialViewport = React.useMemo<GridViewport>(
    () => ({ height, offsetX: 0, offsetY: 0, pixelsPerUnitX: zoomX, pixelsPerUnitY: zoomY, width }),
    [height, width, zoomX, zoomY],
  );
  const [uncontrolledViewport, setUncontrolledViewport] = React.useState(initialViewport);
  const viewport = controlledViewport ?? uncontrolledViewport;
  const cellPlacements = React.useMemo(
    () =>
      getVisibleMatrixCells(
        layout,
        cells,
        {
          height: contentSize.height,
          offsetX: 0,
          offsetY: 0,
          pixelsPerUnitX: 1,
          pixelsPerUnitY: 1,
          width: contentSize.width,
        },
        overscanPixels,
      ),
    [cells, contentSize.height, contentSize.width, layout, overscanPixels],
  );
  const [visibleIds, setVisibleIds] = React.useState<readonly string[]>([]);
  const anchorId = React.useRef<string | null>(null);
  const cellById = React.useMemo(
    () => new Map(cellPlacements.map((cell) => [cell.id, cell])),
    [cellPlacements],
  );

  const handleViewportChange = React.useCallback(
    (proposal: GridViewport) => {
      if (controlledViewport === undefined) setUncontrolledViewport(proposal);
      onViewportChange?.(proposal);
    },
    [controlledViewport, onViewportChange],
  );

  const activateCell = React.useCallback(
    (cell: GridMatrixCellPlacement, event: unknown) => {
      if (interactionPolicy === 'passive') return;
      const intent = isRangeSelectionEvent(event)
        ? 'range'
        : resolveSelectionEventIntent(event, 'pointer');
      onSelectionChange?.(
        resolveMatrixGridSelection(
          cellPlacements,
          selectedCellIds,
          cell.id,
          anchorId.current,
          intent,
          selectionMode,
        ),
      );
      if (intent !== 'range') anchorId.current = cell.id;
    },
    [cellPlacements, interactionPolicy, onSelectionChange, selectedCellIds, selectionMode],
  );
  const keyboard = useMatrixGridKeyboardFocus(
    cellPlacements,
    interactionPolicy === 'passive',
    visibleIds,
    (targetId, originId, shiftKey) => {
      anchorId.current ??= originId;
      if (!shiftKey) return;
      const cell = cellPlacements.find((candidate) => candidate.id === targetId);
      if (cell) activateCell(cell, { shiftKey: true });
    },
  );

  return (
    <View accessibilityLabel={accessibilityLabel}>
      <GridView
        contentHeight={contentSize.height}
        contentWidth={contentSize.width}
        height={height}
        interactionPolicy={interactionPolicy}
        items={cellPlacements}
        focusedItemId={keyboard.focusedId ?? undefined}
        overscanPixels={0}
        onVisibleItemIdsChange={setVisibleIds}
        renderItem={(item) => {
          const cell = cellById.get(item.id);
          if (!cell) return null;
          return renderMatrixCell(
            cell,
            selectedCellIds,
            theme.semantics.neutral.divider,
            theme.colors.primary,
            renderCell,
            activateCell,
            keyboard,
            testID,
          );
        }}
        testID={testID}
        viewport={viewport}
        width={width}
        onViewportChange={handleViewportChange}
      />
    </View>
  );
}

/*** Render one positioned sparse cell with native/web accessible selection semantics. */
function renderMatrixCell(
  cell: GridMatrixCellPlacement,
  selectedCellIds: readonly string[],
  dividerColor: string,
  selectedColor: string,
  renderCell: MatrixGridProps['renderCell'],
  activateCell: (cell: GridMatrixCellPlacement, event: unknown) => void,
  keyboard: ReturnType<typeof useMatrixGridKeyboardFocus>,
  testID: string | undefined,
) {
  const selected = selectedCellIds.includes(cell.id);
  const canInteract = keyboard.tabStopId === cell.id;
  return (
    <MatrixGridKeyboardProxy
      onKeyDown={(event) => {
        if (keyboard.onKeyDown(cell.id, event.key, event.shiftKey)) return true;
        if (!['Enter', ' '].includes(event.key)) return false;
        activateCell(cell, event);
        return true;
      }}
    >
      <NativePressable
        key={cell.id}
        accessibilityActions={[{ name: 'activate' }]}
        accessibilityLabel={`Cell ${cell.id}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        focusable={Platform.OS !== 'web' || canInteract}
        style={[
          styles.cell,
          {
            borderColor: selected || keyboard.focusedId === cell.id ? selectedColor : dividerColor,
            height: '100%',
            width: '100%',
          },
        ]}
        testID={testID === undefined ? undefined : `${testID}-cell-${cell.id}`}
        onAccessibilityAction={() => activateCell(cell, {})}
        onFocus={() => keyboard.onFocus(cell.id)}
        onPress={(event) => activateCell(cell, event)}
        ref={(node) => keyboard.registerCell(cell.id, node)}
      >
        {renderCell(cell)}
      </NativePressable>
    </MatrixGridKeyboardProxy>
  );
}

/*** Recognize range intent without changing the shared replace-or-toggle selection contract. */
function isRangeSelectionEvent(event: unknown): boolean {
  if (!isRecord(event)) return false;
  if (event.shiftKey === true) return true;
  return (
    (isRecord(event.nativeEvent) && event.nativeEvent.shiftKey === true) ||
    (isRecord(event.originalEvent) && event.originalEvent.shiftKey === true)
  );
}

const styles = StyleSheet.create({
  cell: { borderWidth: 1, height: '100%', overflow: 'hidden', width: '100%' },
});

/*** A code-first generic sparse matrix grid; formulas and domain vocabulary remain external. */
export const MatrixGrid = withZoraThemeScope(MatrixGridInner);
