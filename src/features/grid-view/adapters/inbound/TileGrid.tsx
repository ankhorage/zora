import React from 'react';
import { View as NativeView } from 'react-native';

import type { TileGridProps } from '../../../../types/grid-view';
import { layoutTileGrid } from '../../application/layoutTileGrid';
import { GridView } from './GridView';

/*** Composes a responsive, virtualized tile presentation over the generic GridView renderer. */
export function TileGrid({
  items,
  width,
  height = 440,
  tileSize = 120,
  gap = 12,
  zoom = 1,
  overscanPixels,
  focusedItemId,
  revealPaddingPixels,
  onColumnsChange,
  onVisibleItemIdsChange,
  renderItem,
  interactionPolicy,
  testID,
}: TileGridProps) {
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const resolvedWidth = width ?? measuredWidth;
  const layout = React.useMemo(
    () => layoutTileGrid(items, resolvedWidth, tileSize, gap, zoom),
    [items, resolvedWidth, tileSize, gap, zoom],
  );
  const itemLookup = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  React.useEffect(() => {
    if (resolvedWidth > 0) onColumnsChange?.(layout.columns);
  }, [layout.columns, onColumnsChange, resolvedWidth]);

  return (
    <NativeView
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      style={{ width, height, overflow: 'hidden' }}
      testID={testID}
    >
      {resolvedWidth > 0 ? (
        <GridView
          contentHeight={layout.height}
          contentWidth={Math.max(resolvedWidth / zoom, layout.width)}
          height={height}
          focusedItemId={focusedItemId}
          interactionPolicy={interactionPolicy}
          items={layout.items}
          onVisibleItemIdsChange={onVisibleItemIdsChange}
          overscanPixels={overscanPixels}
          renderItem={(item) => {
            const source = itemLookup.get(item.id);
            return source ? renderItem(source) : null;
          }}
          revealPaddingPixels={revealPaddingPixels}
          width={resolvedWidth}
          zoom={zoom}
        />
      ) : null}
    </NativeView>
  );
}
