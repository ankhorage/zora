import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { SidebarLayout } from '../sidebar-layout';
import type { TopbarLayoutProps } from './types';

function TopbarLayoutInner({
  themeId: _themeId,
  mode: _mode,
  topbar,
  children,
  sidebar,
  testID,
}: TopbarLayoutProps) {
  return (
    <Stack gap="l" testID={testID}>
      <Box>{topbar}</Box>
      {sidebar ? <SidebarLayout sidebar={sidebar}>{children}</SidebarLayout> : children}
    </Stack>
  );
}

export const TopbarLayout = withZoraThemeScope(TopbarLayoutInner);
