import { Box, Text, useTheme } from '@ankhorage/surface';
import React from 'react';

import type { FormErrorProps } from './types';

export function FormError({ error, testID }: FormErrorProps) {
  const { theme } = useTheme();

  if (!error) {
    return null;
  }

  return (
    <Box borderColor={theme.colors.error} borderWidth={1} p="s" radius="m" testID={testID}>
      <Text color={theme.colors.error} variant="bodySmall">
        {error}
      </Text>
    </Box>
  );
}
