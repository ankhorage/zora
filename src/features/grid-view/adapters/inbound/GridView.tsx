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
type ScrollAxisMapping = Readonly<{ contentSize: number; origin: number; position: number }>;
type ScrollMapping = Readonly<{
  horizontal: ScrollAxisMapping;
  vertical: ScrollAxisMapping;
}>;

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
  const [isPinching, setIsPinching] = React.useState(false);
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

  const publish = React.useCallback(
    (nextViewport: GridViewport) => {
      if (areViewportsEqual(viewportRef.current, nextViewport)) return;
      viewportRef.current = nextViewport;
      if (uncontrolled) setUncontrolledViewport(nextViewport);
      onViewportChange?.(nextViewport);
    },
    [onViewportChange, uncontrolled],
  );
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
    const position = createScrollMapping(viewport, constraints);
    const nextPosition = {
      x: position.horizontal.position,
      y: position.vertical.position,
    };
    if (areScrollPositionsEqual(scrollPositionRef.current, nextPosition)) return;
    scrollPositionRef.current = nextPosition;
    horizontalScrollRef.current?.scrollTo({ animated: false, x: nextPosition.x });
    verticalScrollRef.current?.scrollTo({ animated: false, y: nextPosition.y });
  }, [constraints, viewport]);

  React.useEffect(() => {
    const focusedItem = items.find((item) => item.id === focusedItemId);
    if (!focusedItem) return;
    const revealed = revealWorldRect(
      viewportRef.current,
      focusedItem,
      revealPaddingPixels,
      constraints,
    );
    publish(revealed);
  }, [constraints, focusedItemId, items, publish, revealPaddingPixels]);

  const scrollMapping = createScrollMapping(viewport, constraints);

  const syncScrollPosition = () => {
    const nextMapping = createScrollMapping(viewportRef.current, constraints);
    const nextPosition = {
      x: nextMapping.horizontal.position,
      y: nextMapping.vertical.position,
    };
    scrollPositionRef.current = nextPosition;
    horizontalScrollRef.current?.scrollTo({ animated: false, x: nextPosition.x });
    verticalScrollRef.current?.scrollTo({ animated: false, y: nextPosition.y });
  };

  return (
    <NativeView
      accessibilityLabel="Interactive grid viewport"
      onTouchEnd={() => {
        const wasPinching = pinchGestureRef.current !== undefined;
        pinchGestureRef.current = undefined;
        setIsPinching(false);
        if (wasPinching) syncScrollPosition();
      }}
      onTouchMove={(event) => {
        if (!interactive) return;
        const pinch = getPinchGesture(event.nativeEvent.touches, width, height);
        const previous = pinchGestureRef.current;
        pinchGestureRef.current = pinch;
        setIsPinching(pinch !== undefined);
        if (!pinch || !previous) return;
        zoomAt(pinch.focalPoint, pinch.distance / previous.distance);
      }}
      onTouchStart={(event) => {
        pinchGestureRef.current = getPinchGesture(event.nativeEvent.touches, width, height);
        setIsPinching(pinchGestureRef.current !== undefined);
      }}
      style={{ height, overflow: 'hidden', width }}
      testID={testID}
    >
      <NativeScrollView
        ref={horizontalScrollRef}
        testID={testID ? `${testID}-horizontal-scroll` : undefined}
        horizontal
        scrollEnabled={interactive && !isPinching}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator
        style={{ height, width }}
        onScroll={(event) => {
          if (pinchGestureRef.current) return;
          const { x } = event.nativeEvent.contentOffset;
          const displacement = x - scrollPositionRef.current.x;
          scrollPositionRef.current = { ...scrollPositionRef.current, x };
          if (displacement !== 0) pan({ x: -displacement, y: 0 });
        }}
      >
        <NativeScrollView
          ref={verticalScrollRef}
          testID={testID ? `${testID}-vertical-scroll` : undefined}
          scrollEnabled={interactive && !isPinching}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          style={{ height, width: scrollMapping.horizontal.contentSize }}
          onScroll={(event) => {
            if (pinchGestureRef.current) return;
            const { y } = event.nativeEvent.contentOffset;
            const displacement = y - scrollPositionRef.current.y;
            scrollPositionRef.current = { ...scrollPositionRef.current, y };
            if (displacement !== 0) pan({ x: 0, y: -displacement });
          }}
        >
          <NativeView
            style={{
              height: scrollMapping.vertical.contentSize,
              width: scrollMapping.horizontal.contentSize,
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
                    left: position.x + scrollMapping.horizontal.origin,
                    position: 'absolute',
                    top: position.y + scrollMapping.vertical.origin,
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

/*** Maps engine-constrained world offsets to nonnegative native scroll coordinates. */
function createScrollMapping(
  viewport: GridViewport,
  constraints: GridViewportConstraints,
): ScrollMapping {
  const horizontalMinimum = constrainViewport(
    { ...viewport, offsetX: -Number.MAX_SAFE_INTEGER },
    constraints,
  ).offsetX;
  const horizontalMaximum = constrainViewport(
    { ...viewport, offsetX: Number.MAX_SAFE_INTEGER },
    constraints,
  ).offsetX;
  const verticalMinimum = constrainViewport(
    { ...viewport, offsetY: -Number.MAX_SAFE_INTEGER },
    constraints,
  ).offsetY;
  const verticalMaximum = constrainViewport(
    { ...viewport, offsetY: Number.MAX_SAFE_INTEGER },
    constraints,
  ).offsetY;
  return {
    horizontal: createScrollAxisMapping({
      maximum: horizontalMaximum,
      minimum: horizontalMinimum,
      offset: viewport.offsetX,
      scale: viewport.pixelsPerUnitX,
      viewportSize: viewport.width,
    }),
    vertical: createScrollAxisMapping({
      maximum: verticalMaximum,
      minimum: verticalMinimum,
      offset: viewport.offsetY,
      scale: viewport.pixelsPerUnitY,
      viewportSize: viewport.height,
    }),
  };
}

type ScrollAxisMappingInput = Readonly<{
  maximum: number;
  minimum: number;
  offset: number;
  scale: number;
  viewportSize: number;
}>;

/*** Derives a physical scroll axis from the published engine constraint result. */
function createScrollAxisMapping({
  maximum,
  minimum,
  offset,
  scale,
  viewportSize,
}: ScrollAxisMappingInput): ScrollAxisMapping {
  const range = (maximum - minimum) * scale;
  return {
    contentSize: viewportSize + range,
    origin: -minimum * scale,
    position: (offset - minimum) * scale,
  };
}

/*** Compares canonical viewport fields without treating equal proposals as state changes. */
function areViewportsEqual(left: GridViewport, right: GridViewport): boolean {
  return (
    left.width === right.width &&
    left.height === right.height &&
    left.offsetX === right.offsetX &&
    left.offsetY === right.offsetY &&
    left.pixelsPerUnitX === right.pixelsPerUnitX &&
    left.pixelsPerUnitY === right.pixelsPerUnitY
  );
}

/*** Avoids requesting native scrolling again when the physical position is already current. */
function areScrollPositionsEqual(left: ScrollPosition, right: ScrollPosition): boolean {
  return left.x === right.x && left.y === right.y;
}

/*** Extracts a stable two-finger focal point and distance from native or web touch data. */
function getPinchGesture(
  touches: readonly Readonly<{
    pageX: number;
    pageY: number;
    locationX?: number;
    locationY?: number;
  }>[],
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
      x: Math.min(
        width,
        Math.max(0, ((first.locationX ?? first.pageX) + (second.locationX ?? second.pageX)) / 2),
      ),
      y: Math.min(
        height,
        Math.max(0, ((first.locationY ?? first.pageY) + (second.locationY ?? second.pageY)) / 2),
      ),
    },
  };
}
