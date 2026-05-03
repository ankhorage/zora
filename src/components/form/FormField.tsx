import { Field, Stack } from '@ankhorage/surface';
import React from 'react';

import { Input } from '../input';
import { Text } from '../text';
import type { FormFieldConfig, FormFieldControlProps, FormFieldProps } from './types';
import { hasRequiredRule } from './validation';

function isControlFieldProps<TName extends string>(
  props: FormFieldProps<TName>,
): props is FormFieldControlProps<TName> {
  return 'field' in props;
}

function resolveKeyboardType(field: FormFieldConfig) {
  if (field.keyboardType) {
    return field.keyboardType;
  }

  if (field.type === 'email') {
    return 'email-address';
  }

  if (field.type === 'number' || field.type === 'otp') {
    return 'number-pad';
  }

  if (field.type === 'tel') {
    return 'phone-pad';
  }

  if (field.type === 'url') {
    return 'url';
  }

  return undefined;
}

function resolveAutoCapitalize(field: FormFieldConfig) {
  if (field.autoCapitalize) {
    return field.autoCapitalize;
  }

  if (['email', 'password', 'url'].includes(field.type ?? 'text')) {
    return 'none';
  }

  return undefined;
}

function resolveTextContentType(field: FormFieldConfig) {
  if (field.textContentType) {
    return field.textContentType;
  }

  if (field.type === 'email') {
    return 'emailAddress';
  }

  if (field.type === 'password') {
    return 'password';
  }

  if (field.type === 'otp') {
    return 'oneTimeCode';
  }

  return undefined;
}

function renderLabel(label: React.ReactNode, description: React.ReactNode | undefined) {
  return (
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
  );
}

export function FormField<TName extends string = string>(props: FormFieldProps<TName>) {
  if (!isControlFieldProps(props)) {
    const { label, description, helperText, children, ...fieldProps } = props;

    return (
      <Field {...fieldProps} helperText={helperText} label={renderLabel(label, description)}>
        {children}
      </Field>
    );
  }

  const { field, value, error, disabled = false, loading = false, onChange, testID } = props;
  const fieldDisabled = disabled || loading || field.disabled;
  const required = field.required ?? hasRequiredRule(field.rules);

  return (
    <Field
      disabled={fieldDisabled}
      errorText={error}
      helperText={field.helperText}
      invalid={Boolean(error)}
      label={renderLabel(field.label, field.description)}
      readOnly={field.readOnly}
      required={required}
      testID={testID ?? field.testID}
    >
      <Input
        accessibilityLabel={typeof field.label === 'string' ? field.label : undefined}
        autoCapitalize={resolveAutoCapitalize(field)}
        autoComplete={field.autoComplete}
        disabled={fieldDisabled}
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
