import React from 'react';
import { ScrollView } from 'react-native';

import { useZoraTheme } from '../../../../theme/useZoraTheme';
import type { ContentRailProps } from '../../../../types/content-rail';

/*** Wraps intrinsically sized content in a free horizontal native scroll view. */
export function ContentRailFlow({
  children,
  gap = 'm',
  padding = 'm',
  direction = 'auto',
  bounces,
  showsScrollIndicator = false,
  accessibilityLabel = 'Content rail',
  interactionPolicy,
  testID,
}: ContentRailProps) {
  const { theme } = useZoraTheme();
  const spacing = new Map(Object.entries(theme.spacing));
  return (
    <ScrollView
      horizontal
      bounces={bounces}
      scrollEnabled={interactionPolicy !== 'passive'}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        direction: direction === 'auto' ? undefined : direction,
        gap: gap === 'none' ? 0 : spacing.get(gap),
        paddingHorizontal: padding === 'none' ? 0 : spacing.get(padding),
      }}
    >
      {children}
    </ScrollView>
  );
}
