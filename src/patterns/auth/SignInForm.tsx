import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { Form, type FormFieldConfig, type FormValues } from '../../components/form';
import type { SignInFormProps } from './types';
import {
  defaultIdentifiers,
  normalizeIdentifierKind,
  resolveIdentifierLabel,
  resolveIdentifierRules,
  resolveIdentifierType,
} from './utils';

type SignInFieldName = 'identifier' | 'secret';

export function SignInForm({
  identifiers = defaultIdentifiers,
  identifierLabel,
  secretLabel = 'Password',
  forgotPasswordLabel = 'Forgot password',
  signUpLabel = 'Sign up',
  loading = false,
  disabled = false,
  error,
  submitLabel = 'Sign in',
  onSubmit,
  onForgotPassword,
  onSignUp,
  testID,
}: SignInFormProps) {
  const [values, setValues] = React.useState<FormValues<SignInFieldName>>({
    identifier: '',
    secret: '',
  });
  const hasActions = Boolean(onForgotPassword ?? onSignUp);
  const fields = React.useMemo<readonly FormFieldConfig<SignInFieldName>[]>(
    () => [
      {
        name: 'identifier',
        label: identifierLabel ?? resolveIdentifierLabel(identifiers),
        type: resolveIdentifierType(identifiers),
        autoCapitalize: 'none',
        rules: resolveIdentifierRules(identifiers),
      },
      {
        name: 'secret',
        label: secretLabel,
        type: 'password',
        rules: [{ kind: 'required' }],
      },
    ],
    [identifierLabel, identifiers, secretLabel],
  );

  const handleSubmit = React.useCallback(
    (formValues: FormValues<SignInFieldName>) =>
      onSubmit({
        identifier: formValues.identifier.trim(),
        identifierKind: normalizeIdentifierKind(formValues.identifier, identifiers),
        secret: formValues.secret,
      }),
    [identifiers, onSubmit],
  );

  return (
    <Form
      actions={
        hasActions ? (
          <Stack direction="row" gap="s" wrap="wrap">
            {onForgotPassword ? (
              <Button
                disabled={disabled || loading}
                emphasis="ghost"
                onPress={() => {
                  void onForgotPassword();
                }}
                size="s"
                tone="neutral"
              >
                {forgotPasswordLabel}
              </Button>
            ) : null}
            {onSignUp ? (
              <Button
                disabled={disabled || loading}
                emphasis="ghost"
                onPress={() => {
                  void onSignUp();
                }}
                size="s"
                tone="neutral"
              >
                {signUpLabel}
              </Button>
            ) : null}
          </Stack>
        ) : undefined
      }
      disabled={disabled}
      error={error}
      fields={fields}
      loading={loading}
      onChange={setValues}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}
