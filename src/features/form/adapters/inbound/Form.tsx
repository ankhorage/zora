import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { FormProps } from '../../../../types/form';
import { Stack } from '../../../layout/public';
import { FormActions } from './FormActions';

function FormInner({
  themeId: _themeId,
  mode: _mode,
  children,
  onSubmit,
  loading = false,
  disabled = false,
  submitLabel = 'Submit',
  actions,
  testID,
  interactionPolicy,
}: FormProps) {
  return (
    <Stack gap="m" testID={testID}>
      {children}
      <FormActions
        disabled={disabled}
        interactionPolicy={interactionPolicy}
        loading={loading}
        onSubmit={() => {
          if (interactionPolicy !== 'passive') void onSubmit?.();
        }}
        submitLabel={submitLabel}
      >
        {actions}
      </FormActions>
    </Stack>
  );
}

/*** Composes explicit form fields, form errors, and submit actions. */
export const Form = withZoraThemeScope(FormInner);
