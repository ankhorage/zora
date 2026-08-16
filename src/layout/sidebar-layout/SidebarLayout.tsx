import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveSidebarLayoutSizing } from './resolveSidebarLayoutSizing';
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
  sizing,
  testID,
}: SidebarLayoutProps) {
  const layoutSizing = resolveSidebarLayoutSizing(sizing);

  return (
    <Stack
      {...layoutSizing.root}
      direction={{ base: 'column', lg: 'row' }}
      gap="l"
      testID={testID}
    >
      <Box {...layoutSizing.child} width={{ base: '100%', lg: sidebarWidth }}>
        {sidebar}
      </Box>
      <Box {...layoutSizing.child} flex={1} width="100%">
        {children}
      </Box>
      {aside ? (
        <Box {...layoutSizing.child} width={{ base: '100%', lg: asideWidth }}>
          {aside}
        </Box>
      ) : null}
    </Stack>
  );
}

/***
 * Responsive layout with a sidebar and main content area (and optional aside).
 *
 * `sizing="content"` keeps normal content-flow behavior. Use `sizing="fill"` when the layout
 * should fill an already bounded parent so sidebar/content children receive the available space
 * for their own scrolling or gesture ownership.
 */
export const SidebarLayout = withZoraThemeScope(SidebarLayoutInner);
