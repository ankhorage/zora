import { Box, Stack } from '@ankhorage/surface';
import React from 'react';

import { Heading } from '../../components/heading';
import { Text } from '../../components/text';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SectionHeaderProps } from './types';

function SectionHeaderInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  eyebrow,
  actions,
  testID,
}: SectionHeaderProps) {
  return (
    <Stack
      align={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap="m"
      justify="space-between"
      testID={testID}
    >
      <Box flex={1}>
        <Stack gap="xs">
          {eyebrow ? (
            <Text tone="muted" variant="caption" weight="semiBold">
              {eyebrow}
            </Text>
          ) : null}
          <Heading level={3}>{title}</Heading>
          {description ? (
            <Text tone="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </Stack>
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}

export const SectionHeader = withZoraThemeScope(SectionHeaderInner);
