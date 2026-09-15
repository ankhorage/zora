import { Field as SurfaceField } from '@ankhorage/surface';
import React from 'react';

import type { FieldProps } from '../../../../../types/form';
import { View } from '../../../../layout/public';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../../../../typography/public';

function FieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  description,
  helperText,
  children,
  interactionPolicy: _interactionPolicy,
  ...props
}: FieldProps) {
  return (
    <SurfaceField
      {...props}
      helperText={helperText}
      label={
        <View gap="xs">
          <Text variant="label" weight="semiBold">
            {label}
          </Text>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </View>
      }
    >
      {children}
    </SurfaceField>
  );
}

/*** Groups one form control with its label, description, helper text, and field error. */
export const Field = withZoraThemeScope(FieldInner);
