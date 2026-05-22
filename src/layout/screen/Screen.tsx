import { ScrollArea } from '@ankhorage/surface';
import React from 'react';

import { Box, Container, Stack } from '../../foundation';
import { resolvePageMaxWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ScreenProps } from './types';

function ScreenInner({
  themeId: _themeId,
  mode: _mode,
  children,
  footer,
  scroll = true,
  width = 'default',
  testID,
}: ScreenProps) {
  const content = (
    <Container maxWidth={resolvePageMaxWidth(width)} py="xl" testID={testID}>
      <Stack gap="l">
        {children}
        {footer}
      </Stack>
    </Container>
  );

  if (!scroll) {
    return (
      <Box bg="background" flex={1}>
        {content}
      </Box>
    );
  }

  return (
    <ScrollArea bg="background" style={{ flex: 1 }}>
      {content}
    </ScrollArea>
  );
}

/***
 * Page-level container with standard background and optional scroll behavior.
 *
 
 */
export const Screen = withZoraThemeScope(ScreenInner);
