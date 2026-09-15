import React from 'react';

import type { GradientProps } from '../../../../types/gradient';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useGradientRenderer } from './GradientRendererContext';

function GradientInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
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
  const gradientRenderer = useGradientRenderer();

  return (
    <View
      height={height}
      minHeight={minHeight}
      radius={radius}
      testID={testID}
      width={width}
      style={{ overflow: 'hidden' }}
    >
      {React.createElement(
        gradientRenderer,
        {
          colors,
          end,
          locations,
          start,
          style: { flex: 1 },
        },
        <View p={p} style={{ flex: 1 }}>
          {children}
        </View>,
      )}
    </View>
  );
}

/***
 * Gradient background container for branded loading surfaces, hero blocks, and previews.
 *
 * The host supplies a platform-compatible renderer through
 * `GradientRendererProvider`; ZORA does not require an Expo runtime.
 */
export const Gradient = withZoraThemeScope(GradientInner);
