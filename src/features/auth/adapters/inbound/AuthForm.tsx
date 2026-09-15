import React from 'react';

import type { ZoraBaseProps } from '../../../../types/base';
import type { FormErrors, FormFieldConfig, FormValues } from '../../../../types/form';
import { FormActions, FormError, useFormController } from '../../../form/public';
import { View } from '../../../layout/public';
import { AuthFormField } from './AuthFormField';

interface AuthFormProps<TName extends string> {
  fields: readonly FormFieldConfig<TName>[];
  values: FormValues<TName>;
  onChange: (values: FormValues<TName>) => void;
  onSubmit?: (values: FormValues<TName>) => void | Promise<void>;
  errors?: FormErrors<TName>;
  error?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: React.ReactNode;
  actions?: React.ReactNode;
  testID?: string;
  interactionPolicy?: ZoraBaseProps['interactionPolicy'];
}

/*** Keeps config-driven field orchestration private to the auth patterns that own it. */
export function AuthForm<TName extends string>({
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
  testID,
  interactionPolicy,
}: AuthFormProps<TName>) {
  const controller = useFormController({ fields, values, errors, onChange, onSubmit });
  return (
    <View gap="m" testID={testID}>
      <FormError error={error} />
      {fields.map((field) => (
        <AuthFormField
          key={field.name}
          disabled={disabled}
          error={controller.errors[field.name]}
          field={field}
          interactionPolicy={interactionPolicy}
          loading={loading}
          onChange={controller.setFieldValue}
          value={values[field.name]}
        />
      ))}
      <FormActions
        disabled={disabled}
        interactionPolicy={interactionPolicy}
        loading={loading}
        onSubmit={() => {
          if (interactionPolicy !== 'passive') void controller.handleSubmit();
        }}
        submitLabel={submitLabel}
      >
        {actions}
      </FormActions>
    </View>
  );
}
