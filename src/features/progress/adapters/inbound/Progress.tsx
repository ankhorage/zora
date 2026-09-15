import React from 'react';

import { type ProgressProps, resolveProgressRole } from '../../../../types/progress';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { resolveProgressFraction } from '../../utils/resolveProgressFraction';

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
  interactionPolicy: _interactionPolicy,
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
    <View
      accessibilityRole="progressbar"
      bg={theme.semantics.neutral.surface}
      borderColor={theme.semantics.neutral.divider}
      borderWidth={1}
      radius="full"
      testID={testID}
      style={{ height, overflow: 'hidden' }}
    >
      <View bg={role.base} style={{ height: '100%', width: `${fraction * 100}%` }} />
    </View>
  );
}

/***
 * Progress indicator for determinate and indeterminate loading states.
 */
export const Progress = withZoraThemeScope(ProgressInner);
