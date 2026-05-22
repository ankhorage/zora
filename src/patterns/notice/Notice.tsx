import React from 'react';

import { Badge } from '../../components/badge';
import { Card } from '../../components/card';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { NoticeProps } from './types';

function NoticeInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  children,
  actions,
  color = 'primary',
  testID,
}: NoticeProps) {
  return (
    <Card
      description={description}
      eyebrow={<Badge color={color}>{String(color).toUpperCase()}</Badge>}
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

/***
 * Notice pattern for inline feedback with tone, title, and actions.
 *
 
 */
export const Notice = withZoraThemeScope(NoticeInner);
