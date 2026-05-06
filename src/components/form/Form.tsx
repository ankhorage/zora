import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { FormActions } from './FormActions';
import { FormError } from './FormError';
import { FormField } from './FormField';
import type { FormProps } from './types';
import { useFormController } from './useFormController';

function FormInner<TName extends string = string>({
  themeId: _themeId,
  mode: _mode,
  fields,
  values,
  onChange,
  onSubmit,
  errors,
  error,
  loading = false,
  disabled = false,
  submitLabel = 'Submit',
  actions,
  footer,
  validateOnChange = false,
  testID,
}: FormProps<TName>) {
  const controller = useFormController({
    fields,
    values,
    errors,
    onChange,
    onSubmit,
    validateOnChange,
  });

  return (
    <Stack gap="m" testID={testID}>
      <FormError error={error} />
      {fields.map((field) => (
        <FormField
          key={field.name}
          disabled={disabled}
          error={controller.errors[field.name]}
          field={field}
          loading={loading}
          onChange={controller.setFieldValue}
          value={values[field.name]}
        />
      ))}
      <FormActions
        disabled={disabled}
        loading={loading}
        onSubmit={() => {
          void controller.handleSubmit();
        }}
        submitLabel={submitLabel}
      >
        {actions}
      </FormActions>
      {footer ? <Box>{footer}</Box> : null}
    </Stack>
  );
}

export const Form = withZoraThemeScope(FormInner);
