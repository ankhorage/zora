import { Field } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { FormFieldProps } from '../../../../types/form';
import { Stack } from '../../../layout/public';
import { Text } from '../../../typography/public';

function FormFieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  description,
  helperText,
  children,
  interactionPolicy: _interactionPolicy,
  ...props
}: FormFieldProps) {
  return (
    <Field
      {...props}
      helperText={helperText}
      label={
        <Stack gap="xs">
          <Text variant="label" weight="semiBold">
            {label}
          </Text>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </Stack>
      }
    >
      {children}
    </Field>
  );
}

/*** Groups one form control with its label, description, helper text, and field error. */
export const FormField = withZoraThemeScope(FormFieldInner);
