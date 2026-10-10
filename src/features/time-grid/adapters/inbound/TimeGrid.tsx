import { getLaneIntervalPlacement, type GridViewport } from '@ankhorage/grid-view';
import React from 'react';
import { Pressable, View } from 'react-native';

import type { TimeGridProps } from '../../../../types/time-grid';
import { GridView } from '../../../grid-view/public';
import { resolveTimeGridNextFocusId } from '../../application/resolveTimeGridNextFocusId';
import { resolveTimeGridVisibleIntervals } from '../../application/resolveTimeGridVisibleIntervals';
import { TimeGridKeyboardProxy } from './TimeGridKeyboardProxy';

/*** Presents virtualized variable-height interval lanes through ZORA's shared GridView renderer. */
export function TimeGrid({
  contentWidth,
  focusedIntervalId,
  height,
  interactionPolicy,
  intervals,
  lanes,
  onFocusedIntervalIdChange,
  onIntervalPress,
  onViewportChange,
  onVisibleIntervalIdsChange,
  overscanPixels,
  renderInterval,
  renderLaneLabel,
  revealPaddingPixels,
  selectedIntervalIds = [],
  testID,
  width,
  zoom,
}: TimeGridProps) {
  const scale = Math.max(0.01, zoom ?? 1);
  const [scrollOffsets, setScrollOffsets] = React.useState(() => ({
    offsetX: 0,
    offsetY: 0,
  }));
  const viewport = React.useMemo<GridViewport>(
    () => ({
      ...scrollOffsets,
      height,
      pixelsPerUnitX: scale,
      pixelsPerUnitY: scale,
      width,
    }),
    [height, scale, scrollOffsets, width],
  );
  const intervalById = React.useMemo(
    () => new Map(intervals.map((interval) => [interval.id, interval])),
    [intervals],
  );
  const selectedIds = React.useMemo(() => new Set(selectedIntervalIds), [selectedIntervalIds]);
  const contentHeight = React.useMemo(
    () => lanes.reduce((total, lane) => total + lane.height, 0),
    [lanes],
  );
  const visibleIntervals = React.useMemo(
    () => resolveTimeGridVisibleIntervals(lanes, intervals, viewport, overscanPixels),
    [intervals, lanes, overscanPixels, viewport],
  );
  const focusedPlacement = React.useMemo(() => {
    const focusedInterval = intervals.find((interval) => interval.id === focusedIntervalId);
    return focusedInterval ? getLaneIntervalPlacement(lanes, focusedInterval) : undefined;
  }, [focusedIntervalId, intervals, lanes]);
  const gridItems = React.useMemo(
    () =>
      focusedPlacement && !visibleIntervals.some((interval) => interval.id === focusedPlacement.id)
        ? [...visibleIntervals, focusedPlacement]
        : visibleIntervals,
    [focusedPlacement, visibleIntervals],
  );
  const labelIntervals = React.useMemo(
    () =>
      lanes.map((lane) => ({
        extent: contentWidth,
        id: `lane-label-${lane.id}`,
        laneId: lane.id,
        start: 0,
      })),
    [contentWidth, lanes],
  );
  const visibleLabels = React.useMemo(
    () => resolveTimeGridVisibleIntervals(lanes, labelIntervals, viewport, overscanPixels),
    [labelIntervals, lanes, overscanPixels, viewport],
  );

  const handleViewportChange = React.useCallback(
    (nextViewport: GridViewport) => {
      setScrollOffsets((current) =>
        current.offsetX === nextViewport.offsetX && current.offsetY === nextViewport.offsetY
          ? current
          : { offsetX: nextViewport.offsetX, offsetY: nextViewport.offsetY },
      );
      onViewportChange?.(nextViewport);
    },
    [onViewportChange],
  );

  const resolveNextFocusId = React.useCallback(
    (intervalId: string, direction: 'down' | 'left' | 'right' | 'up') => {
      const allIntervals = resolveTimeGridVisibleIntervals(lanes, intervals, {
        height: contentHeight,
        offsetX: 0,
        offsetY: 0,
        pixelsPerUnitX: 1,
        pixelsPerUnitY: 1,
        width: contentWidth,
      });
      return resolveTimeGridNextFocusId(allIntervals, intervalId, direction);
    },
    [contentHeight, contentWidth, intervals, lanes],
  );

  return (
    <View style={{ flexDirection: 'row', height, width }} testID={testID}>
      {renderLaneLabel ? (
        <View
          accessibilityElementsHidden
          pointerEvents="none"
          style={{ height, overflow: 'hidden' }}
        >
          {visibleLabels.map((placement) => {
            const lane = lanes[placement.laneIndex];
            if (!lane) return null;
            return (
              <View
                key={lane.id}
                style={{
                  height: placement.height * scale,
                  position: 'absolute',
                  top: (placement.y - viewport.offsetY) * scale,
                }}
                testID={testID === undefined ? undefined : `${testID}-lane-label-${lane.id}`}
              >
                {renderLaneLabel(lane)}
              </View>
            );
          })}
        </View>
      ) : null}
      <GridView
        contentHeight={contentHeight}
        contentWidth={contentWidth}
        focusedItemId={focusedIntervalId}
        height={height}
        interactionPolicy={interactionPolicy}
        items={gridItems}
        onViewportChange={handleViewportChange}
        onVisibleItemIdsChange={onVisibleIntervalIdsChange}
        overscanPixels={overscanPixels}
        renderItem={(placement) => {
          const interval = intervalById.get(placement.id);
          if (!interval) return null;
          const selected = selectedIds.has(interval.id);
          return (
            <TimeGridKeyboardProxy
              onKeyDown={(key) => {
                const direction = resolveKeyboardDirection(key);
                const nextId =
                  direction === undefined ? undefined : resolveNextFocusId(interval.id, direction);
                if (!nextId) return false;
                onFocusedIntervalIdChange?.(nextId);
                return true;
              }}
            >
              <Pressable
                accessibilityLabel={`Interval ${interval.id}`}
                accessibilityRole="button"
                disabled={interactionPolicy === 'passive'}
                onPress={() => {
                  onFocusedIntervalIdChange?.(interval.id);
                  onIntervalPress?.(interval);
                }}
                style={{ flex: 1 }}
                testID={testID === undefined ? undefined : `${testID}-interval-${interval.id}`}
              >
                {renderInterval(interval, selected)}
              </Pressable>
            </TimeGridKeyboardProxy>
          );
        }}
        revealPaddingPixels={revealPaddingPixels}
        testID={testID === undefined ? undefined : `${testID}-viewport`}
        width={width}
        zoom={zoom}
      />
    </View>
  );
}

/*** Maps desktop arrow keys to the platform-neutral interval navigation directions. */
function resolveKeyboardDirection(key: string): 'down' | 'left' | 'right' | 'up' | undefined {
  if (key === 'ArrowDown') return 'down';
  if (key === 'ArrowLeft') return 'left';
  if (key === 'ArrowRight') return 'right';
  if (key === 'ArrowUp') return 'up';
  return undefined;
}
