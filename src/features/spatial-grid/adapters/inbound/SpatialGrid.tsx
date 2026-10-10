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
  const interactionBlocked = disabled || interactionPolicy === 'passive';

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
            interactionBlocked,
            readOnly,
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
  interactionBlocked: boolean,
  readOnly: boolean,
  onSelectionChange: SpatialGridProps['onSelectionChange'],
  onActivation: SpatialGridProps['onActivation'],
  onFocusChange: SpatialGridProps['onFocusChange'],
  renderItem: SpatialGridProps['renderItem'],
  testID: string | undefined,
) {
  const interactionDisabled = interactionBlocked || item.disabled === true;
  const editingDisabled = interactionDisabled || readOnly;
  return (
    <NativePressable
      accessibilityLabel={item.accessibilityLabel ?? `Spatial grid item ${item.id}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: editingDisabled, selected }}
      disabled={interactionDisabled}
      style={{ height: '100%', width: '100%' }}
      testID={testID === undefined ? undefined : `${testID}-item-${item.id}`}
      onFocus={() => {
        if (!interactionDisabled) onFocusChange?.(item.id);
      }}
      onLongPress={() => {
        if (!editingDisabled) onActivation?.(item.id);
      }}
      onPress={() => {
        if (editingDisabled) return;
        onSelectionChange?.(item.id);
        onActivation?.(item.id);
      }}
    >
      {renderItem(item, { disabled: editingDisabled, focused, selected })}
    </NativePressable>
  );
}
