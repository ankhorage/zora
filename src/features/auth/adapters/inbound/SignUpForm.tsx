import React from 'react';

import type { SignUpFormProps } from '../../../../types/auth';
import type { FormFieldConfig, FormValues } from '../../../../types/form';
import { Button } from '../../../button/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { AuthForm } from './AuthForm';

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
  interactionPolicy,
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
    <AuthForm
      actions={
        onSignIn ? (
          <View direction="row" gap="s" wrap="wrap">
            <Button
              disabled={disabled || loading}
              variant="ghost"
              onPress={() => {
                void onSignIn();
              }}
              size="s"
              color="neutral"
              interactionPolicy={interactionPolicy}
            >
              {signInLabel}
            </Button>
          </View>
        ) : undefined
      }
      disabled={disabled}
      error={error}
      fields={fields}
      interactionPolicy={interactionPolicy}
      loading={loading}
      onChange={setValues}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}

/***
 * Sign-up form pattern with structured fields and validation.
 *
 
 */
export const SignUpForm = withZoraThemeScope(SignUpFormInner);
