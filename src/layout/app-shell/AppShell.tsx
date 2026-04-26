import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import type { AppShellProps } from './types';

export function AppShell({ children, topbar, testID }: AppShellProps) {
  return (
    <Box bg="background" flex={1} testID={testID}>
      <Stack gap="none">
        {topbar ? <Box>{topbar}</Box> : null}
        <Box flex={1}>{children}</Box>
      </Stack>
    </Box>
  );
}
