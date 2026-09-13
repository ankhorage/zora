import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { GradientProps } from '../../../../types/gradient';
import { Box } from '../../../layout/public';
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
    <Box
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
        <Box p={p} style={{ flex: 1 }}>
          {children}
        </Box>,
      )}
    </Box>
  );
}

/***
 * Gradient background container for branded loading surfaces, hero blocks, and previews.
 *
 * The host supplies a platform-compatible renderer through
 * `GradientRendererProvider`; ZORA does not require an Expo runtime.
 */
export const Gradient = withZoraThemeScope(GradientInner);
