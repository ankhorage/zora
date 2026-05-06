import React from 'react';

import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Text } from '../text';
import type { FormErrorProps } from './types';

function FormErrorInner({ themeId: _themeId, mode: _mode, error, testID }: FormErrorProps) {
  const { theme } = useZoraTheme();

  if (!error) {
    return null;
  }

  return (
    <Box borderColor={theme.colors.error} borderWidth={1} p="s" radius="m" testID={testID}>
      <Text tone="danger" variant="bodySmall">
        {error}
      </Text>
    </Box>
  );
}

export const FormError = withZoraThemeScope(FormErrorInner);
