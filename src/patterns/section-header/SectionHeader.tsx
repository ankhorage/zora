import React from 'react';

import { Box, Stack } from '../../features/layout/public';
import { Heading } from '../../features/typography/public';
import { Text } from '../../features/typography/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SectionHeaderProps } from './types';

function SectionHeaderInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
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
      <Box flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
        <Stack gap="xs">
          {eyebrow ? (
            <Text emphasis="muted" variant="caption" weight="semiBold">
              {eyebrow}
            </Text>
          ) : null}
          <Heading level={3}>{title}</Heading>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </Stack>
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}

/***
 * Section heading pattern with optional description and action slot.
 *
 
 */
export const SectionHeader = withZoraThemeScope(SectionHeaderInner);
