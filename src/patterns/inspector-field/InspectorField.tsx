import React from 'react';

import { FormField } from '../../features/form/public';
import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { InspectorFieldProps } from './types';

function InspectorFieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  control,
  children,
  interactionPolicy: _interactionPolicy,
  ...props
}: InspectorFieldProps) {
  return (
    <FormField {...props} label={label}>
      <View direction="row" gap="s" align="center">
        <View flex={1}>{children}</View>
        {control ? <View>{control}</View> : null}
      </View>
    </FormField>
  );
}

/***
 * Inspector row pattern with label, description, and control slot.
 *
 
 */
export const InspectorField = withZoraThemeScope(InspectorFieldInner);
