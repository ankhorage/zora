import React from 'react';

import type { ZoraBaseProps } from '../../../../types/base';
import type { FormFieldConfig, FormFieldValue } from '../../../../types/form';
import { Field, hasRequiredRule } from '../../../form/public';
import { TextInput } from '../../../form/text-input/public';

interface AuthFormFieldProps<TName extends string> {
  field: FormFieldConfig<TName>;
  value: FormFieldValue;
  onChange: (name: TName, value: FormFieldValue) => void;
  error?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  interactionPolicy?: ZoraBaseProps['interactionPolicy'];
}

/*** Adapts an auth field configuration to the public compositional form primitives. */
export function AuthFormField<TName extends string>({
  field,
  value,
  onChange,
  error,
  disabled = false,
  loading = false,
  interactionPolicy,
}: AuthFormFieldProps<TName>) {
  const fieldDisabled = disabled || loading || field.disabled;
  return (
    <Field
      description={field.description}
      disabled={fieldDisabled}
      errorText={error}
      helperText={field.helperText}
      invalid={Boolean(error)}
      label={field.label}
      readOnly={field.readOnly}
      required={field.required ?? hasRequiredRule(field.rules)}
      testID={field.testID}
    >
      <TextInput
        accessibilityLabel={typeof field.label === 'string' ? field.label : undefined}
        autoCapitalize={
          field.autoCapitalize ??
          (['email', 'password', 'url'].includes(field.type ?? 'text') ? 'none' : undefined)
        }
        autoComplete={field.autoComplete}
        disabled={fieldDisabled}
        interactionPolicy={interactionPolicy}
        invalid={Boolean(error)}
        keyboardType={resolveKeyboardType(field)}
        maxLength={field.maxLength}
        onChangeText={(nextValue) => onChange(field.name, nextValue)}
        placeholder={field.placeholder}
        readOnly={field.readOnly}
        secureTextEntry={field.secureTextEntry ?? field.type === 'password'}
        textContentType={resolveTextContentType(field)}
        value={value}
      />
    </Field>
  );
}

/*** Resolves the native keyboard for an auth field configuration. */
function resolveKeyboardType(field: FormFieldConfig) {
  if (field.keyboardType) return field.keyboardType;
  if (field.type === 'email') return 'email-address';
  if (field.type === 'number' || field.type === 'otp') return 'number-pad';
  if (field.type === 'tel') return 'phone-pad';
  if (field.type === 'url') return 'url';
  return undefined;
}

/*** Resolves platform text-content hints for an auth field configuration. */
function resolveTextContentType(field: FormFieldConfig) {
  if (field.textContentType) return field.textContentType;
  if (field.type === 'email') return 'emailAddress';
  if (field.type === 'password') return 'password';
  if (field.type === 'otp') return 'oneTimeCode';
  return undefined;
}
