import React from 'react';
import {
  I18nManager,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  type ViewStyle,
} from 'react-native';

import { IconButton } from '../../components/icon-button';
import { Text } from '../../components/text';
import { Box, Inline, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveContentRailItemWidth } from './resolveContentRailItemWidth';
import { resolveContentRailPhysicalOffset } from './resolveContentRailPhysicalOffset';
import { resolveContentRailState } from './resolveContentRailState';
import type { ContentRailProps, ContentRailVisibleRangeChangeEvent } from './types';
import { useContentRailReducedMotion } from './useContentRailReducedMotion';

function ContentRailInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  children,
  itemSize = 'responsive',
  gap = 'm',
  padding = 'm',
  peek = 32,
  showControls = true,
  direction = 'auto',
  motion = 'system',
  accessibilityLabel = 'Content rail',
  previousLabel = 'Previous items',
  nextLabel = 'Next items',
  onControlPress,
  onVisibleRangeChange,
  testID,
}: ContentRailProps) {
  const { theme } = useZoraTheme();
  const items = React.Children.toArray(children);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const lastRangeRef = React.useRef<ContentRailVisibleRangeChangeEvent | null>(null);
  const logicalOffsetRef = React.useRef(0);
  const rtlInitializedRef = React.useRef(false);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);
  const [logicalOffset, setLogicalOffset] = React.useState(0);
  const reducedMotion = useContentRailReducedMotion(motion);
  const isRtl = direction === 'rtl' || (direction === 'auto' && I18nManager.isRTL);
  const gapValue = resolveSpacingValue(theme.spacing, gap);
  const paddingValue = resolveSpacingValue(theme.spacing, padding);
  const itemWidth = resolveContentRailItemWidth({
    gap: gapValue,
    itemCount: items.length,
    itemSize,
    padding: paddingValue,
    peek,
    viewportWidth,
  });
  const railState = resolveContentRailState({
    contentWidth,
    gap: gapValue,
    itemCount: items.length,
    itemWidth,
    logicalOffset,
    viewportWidth,
  });
  const passive = interactionPolicy === 'passive';
  const hasOverflow = railState.maxOffset > 1;

  const emitVisibleRange = React.useCallback(
    (nextOffset: number) => {
      const next = resolveContentRailState({
        contentWidth,
        gap: gapValue,
        itemCount: items.length,
        itemWidth,
        logicalOffset: nextOffset,
        viewportWidth,
      });
      const event = {
        firstVisibleIndex: next.firstVisibleIndex,
        lastVisibleIndex: next.lastVisibleIndex,
        itemCount: items.length,
      };
      const previous = lastRangeRef.current;
      if (
        previous?.firstVisibleIndex === event.firstVisibleIndex &&
        previous.lastVisibleIndex === event.lastVisibleIndex &&
        previous.itemCount === event.itemCount
      ) {
        return;
      }
      lastRangeRef.current = event;
      void onVisibleRangeChange?.(event);
    },
    [contentWidth, gapValue, itemWidth, items.length, onVisibleRangeChange, viewportWidth],
  );

  React.useEffect(() => {
    emitVisibleRange(railState.offset);
  }, [emitVisibleRange, railState.offset]);

  React.useEffect(() => {
    rtlInitializedRef.current = !isRtl;
  }, [isRtl]);

  React.useEffect(() => {
    if (viewportWidth === 0 || contentWidth === 0) return;
    const nextOffset = Math.min(logicalOffsetRef.current, railState.maxOffset);
    scrollViewRef.current?.scrollTo({
      animated: false,
      x: resolveContentRailPhysicalOffset({
        isRtl,
        logicalOffset: nextOffset,
        maxOffset: railState.maxOffset,
      }),
      y: 0,
    });
    rtlInitializedRef.current = true;
  }, [contentWidth, isRtl, itemWidth, railState.maxOffset, viewportWidth]);

  const scrollToIndex = (targetIndex: number, controlDirection: 'previous' | 'next') => {
    if (passive || !hasOverflow) return;
    const clampedIndex = Math.min(Math.max(0, targetIndex), Math.max(0, items.length - 1));
    const targetOffset = Math.min(clampedIndex * railState.stride, railState.maxOffset);
    logicalOffsetRef.current = targetOffset;
    setLogicalOffset(targetOffset);
    scrollViewRef.current?.scrollTo({
      animated: !reducedMotion,
      x: resolveContentRailPhysicalOffset({
        isRtl,
        logicalOffset: targetOffset,
        maxOffset: railState.maxOffset,
      }),
      y: 0,
    });
    emitVisibleRange(targetOffset);
    void onControlPress?.({ direction: controlDirection, targetIndex: clampedIndex });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isRtl && !rtlInitializedRef.current) return;
    const physicalOffset = event.nativeEvent.contentOffset.x;
    const nextOffset = resolveContentRailPhysicalOffset({
      isRtl,
      logicalOffset: physicalOffset,
      maxOffset: railState.maxOffset,
    });
    const clampedOffset = Math.min(Math.max(0, nextOffset), railState.maxOffset);
    logicalOffsetRef.current = clampedOffset;
    setLogicalOffset(clampedOffset);
    emitVisibleRange(clampedOffset);
  };

  const rangeLabel =
    items.length === 0
      ? 'No items'
      : `Items ${railState.firstVisibleIndex + 1}–${railState.lastVisibleIndex + 1} of ${items.length}`;
  const contentStyle: ViewStyle = {
    direction: isRtl ? 'rtl' : 'ltr',
    flexDirection: 'row',
    gap: gapValue,
    paddingHorizontal: paddingValue,
  };

  return (
    <Stack gap="s" testID={testID}>
      {showControls && hasOverflow ? (
        <Inline justify="space-between" wrap="nowrap">
          <Text accessibilityLiveRegion="polite" emphasis="muted" variant="caption">
            {rangeLabel}
          </Text>
          <Inline gap="xs" wrap="nowrap">
            <IconButton
              disabled={passive || !railState.canGoPrevious}
              icon={{ name: isRtl ? 'chevron-forward' : 'chevron-back' }}
              interactionPolicy={interactionPolicy}
              label={previousLabel}
              onPress={() => scrollToIndex(railState.anchorIndex - 1, 'previous')}
              size="l"
            />
            <IconButton
              disabled={passive || !railState.canGoNext}
              icon={{ name: isRtl ? 'chevron-back' : 'chevron-forward' }}
              interactionPolicy={interactionPolicy}
              label={nextLabel}
              onPress={() => scrollToIndex(railState.anchorIndex + 1, 'next')}
              size="l"
            />
          </Inline>
        </Inline>
      ) : null}
      <ScrollView
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="list"
        contentContainerStyle={contentStyle}
        decelerationRate="fast"
        disableIntervalMomentum
        horizontal
        onContentSizeChange={(width) => {
          if (isRtl) rtlInitializedRef.current = false;
          setContentWidth(width);
        }}
        onLayout={(event) => {
          if (isRtl) rtlInitializedRef.current = false;
          setViewportWidth(event.nativeEvent.layout.width);
        }}
        onScroll={handleScroll}
        ref={scrollViewRef}
        scrollEnabled={!passive}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth > 0 ? itemWidth + gapValue : undefined}
      >
        {items.map((item, index) => (
          <Box key={index} style={{ flexShrink: 0, width: itemWidth || undefined }}>
            {item}
          </Box>
        ))}
      </ScrollView>
    </Stack>
  );
}

/**
 * Horizontally browsable, manifest-authorable content with responsive item sizing.
 *
 * ContentRail owns only presentation and scrolling. Apps retain ownership of item data,
 * navigation, recommendations, and route behavior.
 */
export const ContentRail = withZoraThemeScope(ContentRailInner);

function resolveSpacingValue(
  spacing: { none: number; xs: number; s: number; m: number; l: number; xl: number },
  token: NonNullable<ContentRailProps['gap']>,
): number {
  if (token === 'none') return spacing.none;
  if (token === 'xs') return spacing.xs;
  if (token === 's') return spacing.s;
  if (token === 'l') return spacing.l;
  if (token === 'xl') return spacing.xl;
  return spacing.m;
}
