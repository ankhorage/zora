import {
  getVisibleMatrixCells,
  type GridMatrixCellPlacement,
  type GridViewport,
} from '@ankhorage/grid-view';
import { Pressable } from '@ankhorage/surface';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { MatrixGridProps } from '../../../../types/matrix-grid';
import { resolveSelectionEventIntent } from '../../../selection/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveMatrixGridContentSize } from '../../application/resolveMatrixGridContentSize';
import { resolveMatrixGridSelection } from '../../application/resolveMatrixGridSelection';

/*** Render only visible sparse matrix cells using released grid-view placement and culling geometry. */
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
  const [scrollX, setScrollX] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  const contentSize = React.useMemo(() => resolveMatrixGridContentSize(layout), [layout]);
  const viewport = React.useMemo<GridViewport>(
    () =>
      controlledViewport ?? {
        height,
        offsetX: scrollX / Math.max(zoomX, 0.01),
        offsetY: scrollY / Math.max(zoomY, 0.01),
        pixelsPerUnitX: Math.max(zoomX, 0.01),
        pixelsPerUnitY: Math.max(zoomY, 0.01),
        width,
      },
    [controlledViewport, height, scrollX, scrollY, width, zoomX, zoomY],
  );
  const visibleCells = React.useMemo(
    () => getVisibleMatrixCells(layout, cells, viewport, overscanPixels),
    [cells, layout, overscanPixels, viewport],
  );

  React.useEffect(() => {
    onViewportChange?.(viewport);
  }, [onViewportChange, viewport]);

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
  const content = (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.content,
        {
          height: contentSize.height * viewport.pixelsPerUnitY,
          width: contentSize.width * viewport.pixelsPerUnitX,
        },
      ]}
      testID={testID}
    >
      {visibleCells.map((cell) =>
        renderMatrixCell(
          cell,
          viewport,
          selectedCellIds,
          theme.semantics.neutral.divider,
          theme.colors.primary,
          renderCell,
          activateCell,
          testID,
        ),
      )}
    </View>
  );

  if (controlledViewport) {
    return (
      <View style={[styles.controlledViewport, { height, width }]} testID={testID}>
        <View
          style={{
            transform: [
              { translateX: -viewport.offsetX * viewport.pixelsPerUnitX },
              { translateY: -viewport.offsetY * viewport.pixelsPerUnitY },
            ],
          }}
        >
          {content}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      scrollEnabled={interactionPolicy !== 'passive'}
      scrollEventThrottle={32}
      showsHorizontalScrollIndicator
      style={{ height, width }}
      onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
    >
      <ScrollView
        scrollEnabled={interactionPolicy !== 'passive'}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator
        style={{ height, width: contentSize.width * viewport.pixelsPerUnitX }}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
      >
        {content}
      </ScrollView>
    </ScrollView>
  );
}

/*** Render one positioned sparse cell with native/web accessible selection semantics. */
function renderMatrixCell(
  cell: GridMatrixCellPlacement,
  viewport: GridViewport,
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
          height: cell.height * viewport.pixelsPerUnitY,
          left: cell.x * viewport.pixelsPerUnitX,
          top: cell.y * viewport.pixelsPerUnitY,
          width: cell.width * viewport.pixelsPerUnitX,
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
  cell: { borderWidth: 1, overflow: 'hidden', position: 'absolute' },
  content: { position: 'relative' },
  controlledViewport: { overflow: 'hidden' },
});

/*** A code-first generic sparse matrix grid; formulas and domain vocabulary remain external. */
export const MatrixGrid = withZoraThemeScope(MatrixGridInner);
