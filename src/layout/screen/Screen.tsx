import React from 'react';
import { ScrollView } from 'react-native';

import { Container, Stack } from '../../foundation';
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
    return content;
  }

  return <ScrollView>{content}</ScrollView>;
}

export const Screen = withZoraThemeScope(ScreenInner);
