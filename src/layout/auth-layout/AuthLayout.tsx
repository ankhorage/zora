import React from 'react';

import { Card } from '../../components/card';
import { Center, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { AuthLayoutProps } from './types';

function AuthLayoutInner({
  themeId: _themeId,
  mode: _mode,
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

export const AuthLayout = withZoraThemeScope(AuthLayoutInner);
