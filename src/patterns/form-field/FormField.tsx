import { Field } from '@ankhorage/surface';
import React from 'react';

import { Text } from '../../components/text';
import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { FormFieldProps } from './types';

function FormFieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  description,
  helperText,
  children,
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
            <Text tone="muted" variant="bodySmall">
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

export const FormField = withZoraThemeScope(FormFieldInner);
