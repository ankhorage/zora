import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { FormActionsProps } from '../../../../types/form';
import { Button } from '../../../button/public';
import { Box, Stack } from '../../../layout/public';

function FormActionsInner({
  themeId: _themeId,
  mode: _mode,
  submitLabel = 'Submit',
  loading = false,
  disabled = false,
  onSubmit,
  children,
  testID,
  interactionPolicy,
}: FormActionsProps) {
  return (
    <Stack gap="s" testID={testID}>
      <Button
        disabled={disabled}
        fullWidth
        interactionPolicy={interactionPolicy}
        loading={loading}
        onPress={onSubmit}
      >
        {submitLabel}
      </Button>
      {children ? <Box>{children}</Box> : null}
    </Stack>
  );
}

/***
 * Standard submit/action area for forms.
 */
export const FormActions = withZoraThemeScope(FormActionsInner);
