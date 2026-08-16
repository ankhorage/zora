import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SidebarLayoutProps } from './types';

function SidebarLayoutInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  sidebar,
  children,
  aside,
  sidebarWidth = 280,
  asideWidth = 280,
  sizing = 'content',
  testID,
}: SidebarLayoutProps) {
  const ownsViewport = sizing === 'viewport';

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      gap="l"
      testID={testID}
      align={ownsViewport ? 'stretch' : 'flex-start'}
      flex={ownsViewport ? 1 : undefined}
      minHeight={ownsViewport ? 0 : undefined}
      minWidth={ownsViewport ? 0 : undefined}
    >
      <Box
        width={{ base: '100%', lg: sidebarWidth }}
        minHeight={ownsViewport ? 0 : undefined}
        minWidth={ownsViewport ? 0 : undefined}
      >
        {sidebar}
      </Box>
      <Box
        flex={1}
        width="100%"
        minHeight={ownsViewport ? 0 : undefined}
        minWidth={ownsViewport ? 0 : undefined}
      >
        {children}
      </Box>
      {aside ? (
        <Box
          width={{ base: '100%', lg: asideWidth }}
          minHeight={ownsViewport ? 0 : undefined}
          minWidth={ownsViewport ? 0 : undefined}
        >
          {aside}
        </Box>
      ) : null}
    </Stack>
  );
}

/***
 * Responsive layout with a sidebar and main content area (and optional aside).
 *
 * `sizing="content"` keeps the normal content-flow behavior. Use `sizing="viewport"` when the
 * layout itself fills a bounded shell and sidebar/content children need that bounded viewport for
 * their own scrolling or gesture ownership.
 */
export const SidebarLayout = withZoraThemeScope(SidebarLayoutInner);
