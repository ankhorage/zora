import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Heading } from '../../components/heading';
import { Text } from '../../components/text';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PageHeaderProps } from './types';

function PageHeaderInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  eyebrow,
  actions,
  meta,
  testID,
}: PageHeaderProps) {
  return (
    <Stack
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap="l"
      justify="space-between"
      testID={testID}
    >
      <Box flex={1}>
        <Stack gap="s">
          {eyebrow ? (
            <Text tone="muted" variant="caption" weight="semiBold">
              {eyebrow}
            </Text>
          ) : null}
          <Heading level={1}>{title}</Heading>
          {description ? (
            <Text tone="muted" variant="body">
              {description}
            </Text>
          ) : null}
          {meta ? <Box pt="xs">{meta}</Box> : null}
        </Stack>
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}

export const PageHeader = withZoraThemeScope(PageHeaderInner);
