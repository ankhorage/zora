import React from 'react';
import { useWindowDimensions, View } from 'react-native';

const SCREEN_HORIZONTAL_PADDING = 32;

/*** Renders children no wider than `maxWidth` and no wider than the width the parent layout actually grants. */
export function ResponsiveWidth({ children, maxWidth }: ResponsiveWidthProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = React.useState<number>();
  const estimatedWidth = windowWidth - SCREEN_HORIZONTAL_PADDING;
  const availableWidth = measuredWidth ?? (estimatedWidth > 0 ? estimatedWidth : maxWidth);

  return (
    <View
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      style={{ alignSelf: 'stretch' }}
    >
      {children(Math.floor(Math.min(maxWidth, availableWidth)))}
    </View>
  );
}

interface ResponsiveWidthProps {
  readonly children: (width: number) => React.ReactNode;
  readonly maxWidth: number;
}
