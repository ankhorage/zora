import {
  getVisibleGridItems,
  type GridViewport,
  revealWorldRect,
  worldToViewport,
} from '@ankhorage/grid-view';
import React from 'react';
import { ScrollView as NativeScrollView, View as NativeView } from 'react-native';

import type { GridViewProps } from '../../../../types/grid-view';

/***
 * Renders world-positioned items on native and web using the canonical viewport/culling engine.
 *
 * This first renderer uses nested native scroll regions. Only visible items are mounted;
 * logical cells and invisible elements are never rendered.
 */
export function GridView({
  items,
  contentWidth,
  contentHeight,
  width,
  height,
  zoom = 1,
  overscanPixels = 160,
  focusedItemId,
  revealPaddingPixels = 8,
  interactionPolicy,
  onViewportChange,
  onVisibleItemIdsChange,
  renderItem,
  testID,
}: GridViewProps) {
  const [scrollX, setScrollX] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  const horizontalScrollRef = React.useRef<NativeScrollView>(null);
  const verticalScrollRef = React.useRef<NativeScrollView>(null);
  const scale = Math.max(0.01, zoom);
  const viewport = React.useMemo<GridViewport>(
    () => ({
      width,
      height,
      offsetX: scrollX / scale,
      offsetY: scrollY / scale,
      pixelsPerUnitX: scale,
      pixelsPerUnitY: scale,
    }),
    [height, scale, scrollX, scrollY, width],
  );
  const visibleItems = React.useMemo(
    () => getVisibleGridItems(items, viewport, overscanPixels),
    [items, overscanPixels, viewport],
  );
  const viewportVisibleIds = React.useMemo(
    () => getVisibleGridItems(visibleItems, viewport).map((item) => item.id),
    [viewport, visibleItems],
  );
  const previousVisibleIdsRef = React.useRef<readonly string[]>([]);

  React.useEffect(() => {
    if (!onVisibleItemIdsChange) return;
    const previous = previousVisibleIdsRef.current;
    if (
      previous.length === viewportVisibleIds.length &&
      previous.every((id, index) => id === viewportVisibleIds[index])
    ) {
      return;
    }
    previousVisibleIdsRef.current = viewportVisibleIds;
    onVisibleItemIdsChange(viewportVisibleIds);
  }, [onVisibleItemIdsChange, viewportVisibleIds]);

  React.useEffect(() => {
    onViewportChange?.(viewport);
  }, [onViewportChange, viewport]);

  const viewportRef = React.useRef(viewport);
  React.useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  React.useEffect(() => {
    const currentViewport = viewportRef.current;
    const focusedItem = items.find((item) => item.id === focusedItemId);
    if (!focusedItem) return;
    const revealed = revealWorldRect(currentViewport, focusedItem, revealPaddingPixels);
    if (revealed.offsetX !== currentViewport.offsetX) {
      horizontalScrollRef.current?.scrollTo({ x: revealed.offsetX * scale, animated: true });
    }
    if (revealed.offsetY !== currentViewport.offsetY) {
      verticalScrollRef.current?.scrollTo({ y: revealed.offsetY * scale, animated: true });
    }
  }, [focusedItemId, height, items, revealPaddingPixels, scale, width]);

  return (
    <NativeScrollView
      ref={horizontalScrollRef}
      horizontal
      scrollEnabled={interactionPolicy !== 'passive'}
      scrollEventThrottle={32}
      showsHorizontalScrollIndicator
      style={{ width, height }}
      testID={testID}
      onScroll={(event) => setScrollX(event.nativeEvent.contentOffset.x)}
    >
      <NativeScrollView
        ref={verticalScrollRef}
        scrollEnabled={interactionPolicy !== 'passive'}
        scrollEventThrottle={32}
        showsVerticalScrollIndicator
        style={{ width: contentWidth * scale, height }}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
      >
        <NativeView style={{ width: contentWidth * scale, height: contentHeight * scale }}>
          {visibleItems.map((item) => {
            const position = worldToViewport(
              { x: item.x, y: item.y },
              {
                ...viewport,
                offsetX: 0,
                offsetY: 0,
              },
            );
            return (
              <NativeView
                key={item.id}
                style={{
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                  width: item.width * scale,
                  height: item.height * scale,
                }}
              >
                {renderItem(item)}
              </NativeView>
            );
          })}
        </NativeView>
      </NativeScrollView>
    </NativeScrollView>
  );
}
