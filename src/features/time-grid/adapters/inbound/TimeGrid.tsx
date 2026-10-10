import { getLaneIntervalPlacement } from '@ankhorage/grid-view';
import React from 'react';
import { Pressable, View } from 'react-native';

import type { TimeGridProps } from '../../../../types/time-grid';
import { GridView } from '../../../grid-view/public';
import { resolveTimeGridNextFocusId } from '../../application/resolveTimeGridNextFocusId';
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
  const placements = React.useMemo(
    () => intervals.map((interval) => getLaneIntervalPlacement(lanes, interval)),
    [intervals, lanes],
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

  return (
    <View style={{ flexDirection: 'row', height, width }} testID={testID}>
      {renderLaneLabel ? (
        <View accessibilityElementsHidden pointerEvents="none" style={{ height }}>
          {lanes.map((lane) => (
            <View key={lane.id} style={{ height: lane.height * Math.max(0.01, zoom ?? 1) }}>
              {renderLaneLabel(lane)}
            </View>
          ))}
        </View>
      ) : null}
      <GridView
        contentHeight={contentHeight}
        contentWidth={contentWidth}
        focusedItemId={focusedIntervalId}
        height={height}
        interactionPolicy={interactionPolicy}
        items={placements}
        onViewportChange={onViewportChange}
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
                  direction === undefined
                    ? undefined
                    : resolveTimeGridNextFocusId(placements, interval.id, direction);
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
