import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { FormField } from '../form-field';
import type { InspectorFieldProps } from './types';

function InspectorFieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  control,
  children,
  ...props
}: InspectorFieldProps) {
  return (
    <FormField {...props} label={label}>
      <Stack direction="row" gap="s" align="center">
        <Box flex={1}>{children}</Box>
        {control ? <Box>{control}</Box> : null}
      </Stack>
    </FormField>
  );
}

export const InspectorField = withZoraThemeScope(InspectorFieldInner);
