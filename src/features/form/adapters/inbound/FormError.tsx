import React from 'react';

import type { FormErrorProps } from '../../../../types/form';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

function FormErrorInner({ themeId: _themeId, mode: _mode, error, testID }: FormErrorProps) {
  const { theme } = useZoraTheme();
  if (!error) return null;
  return (
    <View borderColor={theme.colors.error} borderWidth={1} p="s" radius="m" testID={testID}>
      <Text color="error" variant="bodySmall">
        {error}
      </Text>
    </View>
  );
}

/*** Displays a form-level validation or submission error. */
export const FormError = withZoraThemeScope(FormErrorInner);
