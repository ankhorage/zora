import {
  constrainViewport,
  getVisibleGridItems,
  type GridPoint,
  type GridViewport,
  type GridViewportConstraints,
  panViewport,
  revealWorldRect,
  worldToViewport,
  zoomViewportAt,
} from '@ankhorage/grid-view';
import React from 'react';
import {
  Pressable as NativePressable,
  ScrollView as NativeScrollView,
  Text as NativeText,
  View as NativeView,
} from 'react-native';

import type { GridViewProps } from '../../../../types/grid-view';

type ScrollPosition = Readonly<{ x: number; y: number }>;
type PinchGesture = Readonly<{ distance: number; focalPoint: GridPoint }>;

/*** Renders a controlled or uncontrolled, virtualized 2D world through the canonical grid viewport engine. */
export function GridView({
  items,
  contentWidth,
  contentHeight,
  width,
  height,
  viewport: controlledViewport,
  defaultViewport,
  viewportConstraints,
  zoomLimits,
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
  const [uncontrolledViewport, setUncontrolledViewport] = React.useState(() =>
    createInitialViewport(width, height, zoom, defaultViewport),
  );
  const horizontalScrollRef = React.useRef<NativeScrollView>(null);
  const verticalScrollRef = React.useRef<NativeScrollView>(null);
  const scrollPositionRef = React.useRef<ScrollPosition>({ x: 0, y: 0 });
  const pinchGestureRef = React.useRef<PinchGesture | undefined>(undefined);
  const constraints = React.useMemo(
    () => viewportConstraints ?? createContentConstraints(contentWidth, contentHeight),
    [contentHeight, contentWidth, viewportConstraints],
  );
  const sourceViewport = controlledViewport ?? uncontrolledViewport;
  const viewport = React.useMemo(
    () => constrainViewport({ ...sourceViewport, height, width }, constraints),
    [constraints, height, sourceViewport, width],
  );
  const viewportRef = React.useRef(viewport);
  const visibleItems = React.useMemo(
    () => getVisibleGridItems(items, viewport, overscanPixels),
    [items, overscanPixels, viewport],
  );
  const viewportVisibleIds = React.useMemo(
    () => getVisibleGridItems(visibleItems, viewport).map((item) => item.id),
    [viewport, visibleItems],
  );
  const previousVisibleIdsRef = React.useRef<readonly string[]>([]);
  const uncontrolled = controlledViewport === undefined;
  const interactive = interactionPolicy !== 'passive';

  const publish = (nextViewport: GridViewport) => {
    viewportRef.current = nextViewport;
    if (uncontrolled) setUncontrolledViewport(nextViewport);
    onViewportChange?.(nextViewport);
  };
  const pan = (displacement: GridPoint) =>
    publish(panViewport(viewportRef.current, displacement, constraints));
  const zoomAt = (focalPoint: GridPoint, factor: number) =>
    publish(
      zoomViewportAt(
        viewportRef.current,
        focalPoint,
        {
          pixelsPerUnitX: viewportRef.current.pixelsPerUnitX * factor,
          pixelsPerUnitY: viewportRef.current.pixelsPerUnitY * factor,
        },
        zoomLimits,
        constraints,
      ),
    );

  React.useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  React.useEffect(() => {
    if (!onVisibleItemIdsChange) return;
    const previous = previousVisibleIdsRef.current;
    if (
      previous.length === viewportVisibleIds.length &&
      previous.every((id, index) => id === viewportVisibleIds.at(index))
    ) {
      return;
    }
    previousVisibleIdsRef.current = viewportVisibleIds;
    onVisibleItemIdsChange(viewportVisibleIds);
  }, [onVisibleItemIdsChange, viewportVisibleIds]);

  React.useEffect(() => {
    const position = viewportToScrollPosition(viewport);
    scrollPositionRef.current = position;
    horizontalScrollRef.current?.scrollTo({ animated: false, x: position.x });
    verticalScrollRef.current?.scrollTo({ animated: false, y: position.y });
  }, [viewport]);

  React.useEffect(() => {
    const focusedItem = items.find((item) => item.id === focusedItemId);
    if (!focusedItem) return;
    const revealed = revealWorldRect(
      viewportRef.current,
      focusedItem,
      revealPaddingPixels,
      constraints,
    );
    viewportRef.current = revealed;
    if (uncontrolled) setUncontrolledViewport(revealed);
    onViewportChange?.(revealed);
  }, [constraints, focusedItemId, items, onViewportChange, revealPaddingPixels, uncontrolled]);

  return (
    <NativeView
      accessibilityLabel="Interactive grid viewport"
      onTouchEnd={() => {
        pinchGestureRef.current = undefined;
      }}
      onTouchMove={(event) => {
        if (!interactive) return;
        const pinch = getPinchGesture(event.nativeEvent.touches, width, height);
        const previous = pinchGestureRef.current;
        pinchGestureRef.current = pinch;
        if (!pinch || !previous) return;
        zoomAt(pinch.focalPoint, pinch.distance / previous.distance);
      }}
      onTouchStart={(event) => {
        pinchGestureRef.current = getPinchGesture(event.nativeEvent.touches, width, height);
      }}
      style={{ height, overflow: 'hidden', width }}
      testID={testID}
    >
      <NativeScrollView
        ref={horizontalScrollRef}
        horizontal
        scrollEnabled={interactive}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator
        style={{ height, width }}
        onScroll={(event) => {
          const { x } = event.nativeEvent.contentOffset;
          const displacement = x - scrollPositionRef.current.x;
          scrollPositionRef.current = { ...scrollPositionRef.current, x };
          if (displacement !== 0) pan({ x: -displacement, y: 0 });
        }}
      >
        <NativeScrollView
          ref={verticalScrollRef}
          scrollEnabled={interactive}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          style={{ height, width: contentWidth * viewport.pixelsPerUnitX }}
          onScroll={(event) => {
            const { y } = event.nativeEvent.contentOffset;
            const displacement = y - scrollPositionRef.current.y;
            scrollPositionRef.current = { ...scrollPositionRef.current, y };
            if (displacement !== 0) pan({ x: 0, y: -displacement });
          }}
        >
          <NativeView
            style={{
              height: contentHeight * viewport.pixelsPerUnitY,
              width: contentWidth * viewport.pixelsPerUnitX,
            }}
          >
            {visibleItems.map((item) => {
              const position = worldToViewport(
                { x: item.x, y: item.y },
                { ...viewport, offsetX: 0, offsetY: 0 },
              );
              return (
                <NativeView
                  key={item.id}
                  style={{
                    height: item.height * viewport.pixelsPerUnitY,
                    left: position.x,
                    position: 'absolute',
                    top: position.y,
                    width: item.width * viewport.pixelsPerUnitX,
                  }}
                >
                  {renderItem(item)}
                </NativeView>
              );
            })}
          </NativeView>
        </NativeScrollView>
      </NativeScrollView>
      {interactive ? (
        <NativeView accessibilityLabel="Viewport controls" style={controlsStyle}>
          <NativePressable
            accessibilityLabel="Pan left"
            accessibilityRole="button"
            onPress={() => pan({ x: 48, y: 0 })}
          >
            <NativeText>←</NativeText>
          </NativePressable>
          <NativePressable
            accessibilityLabel="Pan right"
            accessibilityRole="button"
            onPress={() => pan({ x: -48, y: 0 })}
          >
            <NativeText>→</NativeText>
          </NativePressable>
          <NativePressable
            accessibilityLabel="Pan up"
            accessibilityRole="button"
            onPress={() => pan({ x: 0, y: 48 })}
          >
            <NativeText>↑</NativeText>
          </NativePressable>
          <NativePressable
            accessibilityLabel="Pan down"
            accessibilityRole="button"
            onPress={() => pan({ x: 0, y: -48 })}
          >
            <NativeText>↓</NativeText>
          </NativePressable>
          <NativePressable
            accessibilityLabel="Zoom in"
            accessibilityRole="button"
            onPress={() => zoomAt({ x: width / 2, y: height / 2 }, 1.2)}
          >
            <NativeText>+</NativeText>
          </NativePressable>
          <NativePressable
            accessibilityLabel="Zoom out"
            accessibilityRole="button"
            onPress={() => zoomAt({ x: width / 2, y: height / 2 }, 1 / 1.2)}
          >
            <NativeText>−</NativeText>
          </NativePressable>
        </NativeView>
      ) : null}
    </NativeView>
  );
}

const controlsStyle = { bottom: 8, gap: 4, position: 'absolute' as const, right: 8 };

/*** Builds the initial world position and independent scales for uncontrolled rendering. */
function createInitialViewport(
  width: number,
  height: number,
  zoom: number,
  viewport: GridViewProps['defaultViewport'],
): GridViewport {
  return {
    height,
    offsetX: viewport?.offsetX ?? 0,
    offsetY: viewport?.offsetY ?? 0,
    pixelsPerUnitX: viewport?.pixelsPerUnitX ?? zoom,
    pixelsPerUnitY: viewport?.pixelsPerUnitY ?? zoom,
    width,
  };
}

/*** Uses the rendered content extent as the default finite world boundary. */
function createContentConstraints(
  contentWidth: number,
  contentHeight: number,
): GridViewportConstraints {
  return { world: { height: contentHeight, width: contentWidth, x: 0, y: 0 } };
}

/*** Converts canonical world offsets into native scroll coordinates without changing geometry. */
function viewportToScrollPosition(viewport: GridViewport): ScrollPosition {
  return {
    x: viewport.offsetX * viewport.pixelsPerUnitX,
    y: viewport.offsetY * viewport.pixelsPerUnitY,
  };
}

/*** Extracts a stable two-finger focal point and distance from native or web touch data. */
function getPinchGesture(
  touches: readonly Readonly<{ pageX: number; pageY: number }>[],
  width: number,
  height: number,
): PinchGesture | undefined {
  const [first, second] = touches;
  if (!first || !second) return undefined;
  const deltaX = second.pageX - first.pageX;
  const deltaY = second.pageY - first.pageY;
  const distance = Math.hypot(deltaX, deltaY);
  if (!Number.isFinite(distance) || distance === 0) return undefined;
  return {
    distance,
    focalPoint: {
      x: Math.min(width, Math.max(0, (first.pageX + second.pageX) / 2)),
      y: Math.min(height, Math.max(0, (first.pageY + second.pageY) / 2)),
    },
  };
}
