import React from 'react';

import { Box, Inline } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { FilterBarProps } from './types';

function FilterBarInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  leading,
  trailing,
  children,
  wrap = true,
}: FilterBarProps) {
  return (
    <Inline align="center" gap="s" testID={testID} wrap={wrap ? 'wrap' : 'nowrap'}>
      {leading ? <Box>{leading}</Box> : null}
      <Box flex={1}>{children}</Box>
      {trailing ? <Box>{trailing}</Box> : null}
    </Inline>
  );
}

export const FilterBar = withZoraThemeScope(FilterBarInner);
