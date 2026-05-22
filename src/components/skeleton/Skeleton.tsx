import React from 'react';

import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SkeletonProps } from './types';

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
    <Box
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
