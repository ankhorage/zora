import {
  getVisibleMatrixCells,
  type GridMatrixCellPlacement,
  type GridViewport,
} from '@ankhorage/grid-view';
import { Pressable } from '@ankhorage/surface';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { MatrixGridProps } from '../../../../types/matrix-grid';
import { GridView } from '../../../grid-view/public';
import { resolveSelectionEventIntent } from '../../../selection/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveMatrixGridContentSize } from '../../application/resolveMatrixGridContentSize';
import { resolveMatrixGridSelection } from '../../application/resolveMatrixGridSelection';

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
  const visibleCells = React.useMemo(
    () => getVisibleMatrixCells(layout, cells, viewport, overscanPixels),
    [cells, layout, overscanPixels, viewport],
  );

  const visibleCellById = React.useMemo(
    () => new Map(visibleCells.map((cell) => [cell.id, cell])),
    [visibleCells],
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
      const intent = resolveSelectionEventIntent(event, 'pointer');
      onSelectionChange?.(
        resolveMatrixGridSelection(selectedCellIds, cell.id, intent, selectionMode),
      );
    },
    [interactionPolicy, onSelectionChange, selectedCellIds, selectionMode],
  );
  return (
    <View accessibilityLabel={accessibilityLabel}>
      <GridView
        contentHeight={contentSize.height}
        contentWidth={contentSize.width}
        height={height}
        interactionPolicy={interactionPolicy}
        items={visibleCells}
        overscanPixels={0}
        renderItem={(item) => {
          const cell = visibleCellById.get(item.id);
          if (!cell) return null;
          return renderMatrixCell(
            cell,
            selectedCellIds,
            theme.semantics.neutral.divider,
            theme.colors.primary,
            renderCell,
            activateCell,
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
  testID: string | undefined,
) {
  const selected = selectedCellIds.includes(cell.id);
  return (
    <Pressable
      key={cell.id}
      accessibilityLabel={`Cell ${cell.id}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.cell,
        {
          borderColor: selected ? selectedColor : dividerColor,
          height: '100%',
          width: '100%',
        },
      ]}
      testID={testID === undefined ? undefined : `${testID}-cell-${cell.id}`}
      onPress={(event) => activateCell(cell, event)}
    >
      {renderCell(cell)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { borderWidth: 1, height: '100%', overflow: 'hidden', width: '100%' },
});

/*** A code-first generic sparse matrix grid; formulas and domain vocabulary remain external. */
export const MatrixGrid = withZoraThemeScope(MatrixGridInner);
