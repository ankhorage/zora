import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SidebarLayoutProps } from './types';

function SidebarLayoutInner({
  themeId: _themeId,
  mode: _mode,
  sidebar,
  children,
  aside,
  sidebarWidth = 280,
  asideWidth = 280,
  testID,
}: SidebarLayoutProps) {
  return (
    <Stack direction={{ base: 'column', lg: 'row' }} gap="l" testID={testID} align="flex-start">
      <Box width={{ base: '100%', lg: sidebarWidth }}>{sidebar}</Box>
      <Box flex={1} width="100%">
        {children}
      </Box>
      {aside ? <Box width={{ base: '100%', lg: asideWidth }}>{aside}</Box> : null}
    </Stack>
  );
}

export const SidebarLayout = withZoraThemeScope(SidebarLayoutInner);
