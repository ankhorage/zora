import React from 'react';

import { useZoraTheme } from '../../../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { FormErrorProps } from '../../../../types/form';
import { Box } from '../../../layout/public';
import { Text } from '../../../typography/public';

function FormErrorInner({ themeId: _themeId, mode: _mode, error, testID }: FormErrorProps) {
  const { theme } = useZoraTheme();
  if (!error) return null;
  return (
    <Box borderColor={theme.colors.error} borderWidth={1} p="s" radius="m" testID={testID}>
      <Text color="error" variant="bodySmall">
        {error}
      </Text>
    </Box>
  );
}

/*** Displays a form-level validation or submission error. */
export const FormError = withZoraThemeScope(FormErrorInner);
