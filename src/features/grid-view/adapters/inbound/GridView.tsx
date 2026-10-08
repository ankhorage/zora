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

  React.useEffect(() => {
    onViewportChange?.(viewport);
  }, [onViewportChange, viewport]);

  React.useEffect(() => {
    const focusedItem = items.find((item) => item.id === focusedItemId);
    if (!focusedItem) return;
    const revealed = revealWorldRect(viewport, focusedItem, revealPaddingPixels);
    if (revealed.offsetX !== viewport.offsetX) {
      horizontalScrollRef.current?.scrollTo({ x: revealed.offsetX * scale, animated: true });
    }
    if (revealed.offsetY !== viewport.offsetY) {
      verticalScrollRef.current?.scrollTo({ y: revealed.offsetY * scale, animated: true });
    }
  }, [focusedItemId, items, revealPaddingPixels, scale, viewport]);

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
