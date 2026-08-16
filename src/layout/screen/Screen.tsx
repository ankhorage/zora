import { ScrollArea } from '@ankhorage/surface';
import React from 'react';

import { Box, Container, Stack } from '../../foundation';
import { resolvePageMaxWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenProps } from './types';

function ScreenInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  children,
  footer,
  scroll = true,
  width = 'default',
  testID,
}: ScreenProps) {
  if (!scroll) {
    return (
      <Box bg="background" flex={1} minHeight={0} minWidth={0} testID={testID}>
        {children}
        {footer}
      </Box>
    );
  }

  return (
    <ScrollArea bg="background" style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
      <Container maxWidth={resolvePageMaxWidth(width)} py="xl" testID={testID}>
        <Stack gap="l">
          {children}
          {footer}
        </Stack>
      </Container>
    </ScrollArea>
  );
}

/**
 * Outer content boundary for one app screen.
 *
 * By default Screen owns normal vertical scrolling. Set `scroll={false}` to preserve a bounded
 * viewport and delegate scroll or gesture ownership to specialized children such as lists, maps,
 * chats, canvases, or editors.
 */
export const Screen = withZoraThemeScope(ScreenInner);
