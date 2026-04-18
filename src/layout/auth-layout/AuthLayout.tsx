import { Center, Stack } from '@ankhorage/surface';
import React from 'react';

import { Card } from '../../components/card';
import type { AuthLayoutProps } from './types';

export function AuthLayout({
  title,
  description,
  eyebrow,
  children,
  footer,
  testID,
}: AuthLayoutProps) {
  return (
    <Center py="xl" testID={testID}>
      <Card
        compact
        description={description}
        eyebrow={eyebrow}
        footer={footer}
        title={title}
        tone="default"
      >
        <Stack gap="m">{children}</Stack>
      </Card>
    </Center>
  );
}
