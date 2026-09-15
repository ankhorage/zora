import React from 'react';

import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { FilterBarProps } from './types';

function FilterBarInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  testID,
  leading,
  trailing,
  children,
  wrap = true,
}: FilterBarProps) {
  return (
    <View direction="row" align="center" gap="s" testID={testID} wrap={wrap ? 'wrap' : 'nowrap'}>
      {leading ? <View>{leading}</View> : null}
      <View flex={1}>{children}</View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

/***
 * Horizontal filter/action bar layout with leading/trailing slots.
 *
 
 */
export const FilterBar = withZoraThemeScope(FilterBarInner);
