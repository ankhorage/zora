import React from 'react';

import type { SkeletonProps } from '../../../../types/skeleton';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';

function SkeletonInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  width = '100%',
  height = 16,
  radius = 'm',
}: SkeletonProps) {
  const { theme } = useZoraTheme();

  return (
    <View
      accessibilityLabel="Loading"
      accessibilityRole="text"
      bg={theme.semantics.neutral.surfaceHover}
      height={height}
      radius={radius}
      testID={testID}
      width={width}
      style={{ opacity: 0.72 }}
    />
  );
}

/***
 * Generic skeleton placeholder for loading states.
 */
export const Skeleton = withZoraThemeScope(SkeletonInner);
