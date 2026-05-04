import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Badge } from '../../components/badge';
import { Card } from '../../components/card';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { NoticeProps } from './types';

function NoticeInner({
  themeId: _themeId,
  mode: _mode,
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

export const Notice = withZoraThemeScope(NoticeInner);
