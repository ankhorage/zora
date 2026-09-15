import React from 'react';

import type { FormActionsProps } from '../../../../types/form';
import { Button } from '../../../button/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

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
    <View gap="s" testID={testID}>
      <Button
        disabled={disabled}
        fullWidth
        interactionPolicy={interactionPolicy}
        loading={loading}
        onPress={onSubmit}
      >
        {submitLabel}
      </Button>
      {children ? <View>{children}</View> : null}
    </View>
  );
}

/***
 * Standard submit/action area for forms.
 */
export const FormActions = withZoraThemeScope(FormActionsInner);
