import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { SidebarLayout } from '../sidebar-layout';
import type { TopbarLayoutProps } from './types';

export function TopbarLayout({ topbar, children, sidebar, testID }: TopbarLayoutProps) {
  return (
    <Stack gap="l" testID={testID}>
      <Box>{topbar}</Box>
      {sidebar ? <SidebarLayout sidebar={sidebar}>{children}</SidebarLayout> : children}
    </Stack>
  );
}
