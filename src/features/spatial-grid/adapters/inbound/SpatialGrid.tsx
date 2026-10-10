import React from 'react';
import { Pressable as NativePressable, View as NativeView } from 'react-native';

import type { SpatialGridItem, SpatialGridProps } from '../../../../types/spatial-grid';
import { GridView } from '../../../grid-view/public';
import { sortSpatialGridItems } from '../../application/sortSpatialGridItems';

/** Renders virtualized free-placement items without owning geometry, pan, zoom, or drag orchestration. */
export function SpatialGrid({
  items,
  contentWidth,
  contentHeight,
  width,
  height,
  zoom,
  overscanPixels,
  selectedItemId,
  focusedItemId,
  revealPaddingPixels,
  disabled = false,
  readOnly = false,
  interactionPolicy,
  onSelectionChange,
  onActivation,
  onFocusChange,
  onViewportChange,
  onVisibleItemIdsChange,
  renderItem,
  testID,
}: SpatialGridProps) {
  const orderedItems = React.useMemo(() => sortSpatialGridItems(items), [items]);
  const itemLookup = React.useMemo(
    () => new Map(orderedItems.map((item) => [item.id, item])),
    [orderedItems],
  );
  const inactive = disabled || readOnly || interactionPolicy === 'passive';

  return (
    <NativeView style={{ height, overflow: 'hidden', width }} testID={testID}>
      <GridView
        contentHeight={contentHeight}
        contentWidth={contentWidth}
        focusedItemId={focusedItemId ?? selectedItemId}
        height={height}
        interactionPolicy={interactionPolicy}
        items={orderedItems}
        onViewportChange={onViewportChange}
        onVisibleItemIdsChange={onVisibleItemIdsChange}
        overscanPixels={overscanPixels}
        renderItem={(gridItem) => {
          const item = itemLookup.get(gridItem.id);
          if (!item) return null;
          return renderSpatialGridItem(
            item,
            item.id === selectedItemId,
            item.id === focusedItemId,
            inactive,
            onSelectionChange,
            onActivation,
            onFocusChange,
            renderItem,
            testID,
          );
        }}
        revealPaddingPixels={revealPaddingPixels}
        width={width}
        zoom={zoom}
      />
    </NativeView>
  );
}

/** Adds serializable selection, activation, and focus boundaries around a caller-rendered item. */
function renderSpatialGridItem(
  item: SpatialGridItem,
  selected: boolean,
  focused: boolean,
  inactive: boolean,
  onSelectionChange: SpatialGridProps['onSelectionChange'],
  onActivation: SpatialGridProps['onActivation'],
  onFocusChange: SpatialGridProps['onFocusChange'],
  renderItem: SpatialGridProps['renderItem'],
  testID: string | undefined,
) {
  const itemInactive = inactive || item.disabled === true;
  return (
    <NativePressable
      accessibilityLabel={item.accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: itemInactive, selected }}
      disabled={itemInactive}
      style={{ height: '100%', width: '100%' }}
      testID={testID === undefined ? undefined : `${testID}-item-${item.id}`}
      onFocus={() => onFocusChange?.(item.id)}
      onLongPress={() => {
        if (!itemInactive) onActivation?.(item.id);
      }}
      onPress={() => {
        if (itemInactive) return;
        onSelectionChange?.(item.id);
        onActivation?.(item.id);
      }}
    >
      {renderItem(item, { disabled: itemInactive, focused, selected })}
    </NativePressable>
  );
}
