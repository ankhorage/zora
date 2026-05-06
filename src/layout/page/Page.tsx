import React from 'react';

import { Container, Stack } from '../../foundation';
import { resolvePageMaxWidth } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PageProps } from './types';

function PageInner({
  themeId: _themeId,
  mode: _mode,
  children,
  header,
  footer,
  width = 'default',
  testID,
}: PageProps) {
  return (
    <Container maxWidth={resolvePageMaxWidth(width)} py="xl" testID={testID}>
      <Stack gap="l">
        {header}
        {children}
        {footer}
      </Stack>
    </Container>
  );
}

export const Page = withZoraThemeScope(PageInner);
