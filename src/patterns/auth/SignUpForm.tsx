import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { Form, type FormFieldConfig, type FormValues } from '../../components/form';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { SignUpFormProps } from './types';

const defaultSignUpFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoCapitalize: 'none',
    rules: [{ kind: 'required' }, { kind: 'email' }],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    rules: [{ kind: 'required' }, { kind: 'minLength', value: 8 }],
  },
] as const satisfies readonly FormFieldConfig[];

function createValues(fields: readonly FormFieldConfig[]): FormValues {
  const values = fields.reduce<Record<string, string>>((nextValues, field) => {
    nextValues[field.name] = '';
    return nextValues;
  }, {});

  return values;
}

function SignUpFormInner({
  themeId: _themeId,
  mode: _mode,
  fields = defaultSignUpFields,
  signInLabel = 'Sign in',
  loading = false,
  disabled = false,
  error,
  submitLabel = 'Sign up',
  onSubmit,
  onSignIn,
  testID,
}: SignUpFormProps) {
  const [values, setValues] = React.useState<FormValues>(() => createValues(fields));

  return (
    <Form
      actions={
        onSignIn ? (
          <Stack direction="row" gap="s" wrap="wrap">
            <Button
              disabled={disabled || loading}
              emphasis="ghost"
              onPress={() => {
                void onSignIn();
              }}
              size="s"
              tone="neutral"
            >
              {signInLabel}
            </Button>
          </Stack>
        ) : undefined
      }
      disabled={disabled}
      error={error}
      fields={fields}
      loading={loading}
      onChange={setValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}

export const SignUpForm = withZoraThemeScope(SignUpFormInner);
