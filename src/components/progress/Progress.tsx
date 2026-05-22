import React from 'react';

import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveProgressFraction } from './resolveProgressFraction';
import { type ProgressProps, resolveProgressRole } from './types';

function resolveProgressHeight(size: NonNullable<ProgressProps['size']>): number {
  switch (size) {
    case 's':
      return 4;
    case 'm':
      return 6;
    case 'l':
    default:
      return 8;
  }
}

function ProgressInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value,
  max = 100,
  color = 'primary',
  size = 'm',
}: ProgressProps) {
  const { theme } = useZoraTheme();
  const fraction = resolveProgressFraction({ value, max });
  const height = resolveProgressHeight(size);
  const role = resolveProgressRole(theme, color);

  return (
    <Box
      accessibilityRole="progressbar"
      bg={theme.semantics.neutral.surface}
      borderColor={theme.semantics.neutral.divider}
      borderWidth={1}
      radius="full"
      testID={testID}
      style={{ height, overflow: 'hidden' }}
    >
      <Box bg={role.base} style={{ height: '100%', width: `${fraction * 100}%` }} />
    </Box>
  );
}

/***
 * Progress indicator for determinate and indeterminate loading states.
 *
 * @readme
 */
export const Progress = withZoraThemeScope(ProgressInner);
