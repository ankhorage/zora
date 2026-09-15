import React from 'react';

import type { FormProps } from '../../../../types/form';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
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
    <View gap="m" testID={testID}>
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
    </View>
  );
}

/*** Composes explicit form fields, form errors, and submit actions. */
export const Form = withZoraThemeScope(FormInner);
