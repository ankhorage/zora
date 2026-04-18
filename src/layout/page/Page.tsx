import { Container, Stack } from '@ankhorage/surface';
import React from 'react';

import { resolvePageMaxWidth } from '../../internal/recipes';
import type { PageProps } from './types';

export function Page({ children, header, footer, width = 'default', testID }: PageProps) {
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
