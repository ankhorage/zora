import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Button } from '../button';
import type { FormActionsProps } from './types';

function FormActionsInner({
  themeId: _themeId,
  mode: _mode,
  submitLabel = 'Submit',
  loading = false,
  disabled = false,
  onSubmit,
  children,
  testID,
}: FormActionsProps) {
  return (
    <Stack gap="s" testID={testID}>
      <Button disabled={disabled} fullWidth loading={loading} onPress={onSubmit}>
        {submitLabel}
      </Button>
      {children ? <Box>{children}</Box> : null}
    </Stack>
  );
}

export const FormActions = withZoraThemeScope(FormActionsInner);
