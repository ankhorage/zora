import React from 'react';

import { Box, Stack } from '../../foundation';
import { SectionHeader } from '../../patterns/section-header';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenSectionProps } from './types';

function ScreenSectionInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  actions,
  children,
  testID,
}: ScreenSectionProps) {
  return (
    <Stack gap="m" testID={testID} style={{ minWidth: 0, width: '100%' }}>
      {title ? (
        <Box style={{ minWidth: 0, width: '100%' }}>
          <SectionHeader actions={actions} description={description} title={title} />
        </Box>
      ) : null}
      <Box style={{ minWidth: 0, width: '100%' }}>{children}</Box>
    </Stack>
  );
}

export const ScreenSection = withZoraThemeScope(ScreenSectionInner);
