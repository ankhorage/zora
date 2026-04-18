import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import type { SidebarLayoutProps } from './types';

export function SidebarLayout({
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
