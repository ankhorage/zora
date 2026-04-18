import { Field, Stack, Text } from '@ankhorage/surface';
import React from 'react';

import type { FormFieldProps } from './types';

export function FormField({ label, description, helperText, children, ...props }: FormFieldProps) {
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
