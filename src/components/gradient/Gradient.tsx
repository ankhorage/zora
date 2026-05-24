import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import { Box } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { GradientProps } from './types';

function GradientInner({
  themeId: _themeId,
  mode: _mode,
  children,
  colors,
  locations,
  start,
  end,
  width = '100%',
  height,
  minHeight,
  radius,
  p,
  testID,
}: GradientProps) {
  return (
    <Box height={height} minHeight={minHeight} radius={radius} testID={testID} width={width}>
      <LinearGradient
        colors={colors}
        end={end}
        locations={locations}
        start={start}
        style={{ borderRadius: radius === 'full' ? 9999 : undefined, flex: 1, overflow: 'hidden' }}
      >
        <Box p={p} style={{ flex: 1 }}>
          {children}
        </Box>
      </LinearGradient>
    </Box>
  );
}

/***
 * Gradient background container for branded loading surfaces, hero blocks, and previews.
 *
 * `Gradient` is backed by `expo-linear-gradient`. It is a React-rendered ZORA
 * component and does not replace native Expo splash-screen configuration.
 */
export const Gradient = withZoraThemeScope(GradientInner);
