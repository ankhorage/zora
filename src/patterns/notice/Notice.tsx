import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Badge } from '../../components/badge';
import { Card } from '../../components/card';
import type { NoticeProps } from './types';

export function Notice({
  title,
  description,
  children,
  actions,
  tone = 'primary',
  testID,
}: NoticeProps) {
  return (
    <Card
      description={description}
      eyebrow={<Badge tone={tone}>{String(tone).toUpperCase()}</Badge>}
      testID={testID}
      title={title}
      tone="subtle"
    >
      <Stack gap="m">
        {children ? <Box>{children}</Box> : null}
        {actions ? <Box>{actions}</Box> : null}
      </Stack>
    </Card>
  );
}
