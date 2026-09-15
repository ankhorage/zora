import React from 'react';

import type { SignInFormProps } from '../../../../types/auth';
import type { FormFieldConfig, FormValues } from '../../../../types/form';
import { Button } from '../../../button/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import {
  defaultIdentifiers,
  normalizeIdentifierKind,
  resolveIdentifierLabel,
  resolveIdentifierRules,
  resolveIdentifierType,
} from '../../utils/authForm';
import { AuthForm } from './AuthForm';

type SignInFieldName = 'identifier' | 'secret';

function SignInFormInner({
  themeId: _themeId,
  interactionPolicy,
  mode: _mode,
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
      onSubmit?.({
        identifier: formValues.identifier.trim(),
        identifierKind: normalizeIdentifierKind(formValues.identifier, identifiers),
        secret: formValues.secret,
      }),
    [identifiers, onSubmit],
  );

  return (
    <AuthForm
      actions={
        hasActions ? (
          <View direction="row" gap="s" wrap="wrap">
            {onForgotPassword ? (
              <Button
                disabled={disabled || loading}
                variant="ghost"
                onPress={() => {
                  void onForgotPassword();
                }}
                size="s"
                color="neutral"
                interactionPolicy={interactionPolicy}
              >
                {forgotPasswordLabel}
              </Button>
            ) : null}
            {onSignUp ? (
              <Button
                disabled={disabled || loading}
                variant="ghost"
                onPress={() => {
                  void onSignUp();
                }}
                size="s"
                color="neutral"
                interactionPolicy={interactionPolicy}
              >
                {signUpLabel}
              </Button>
            ) : null}
          </View>
        ) : undefined
      }
      disabled={disabled}
      error={error}
      fields={fields}
      interactionPolicy={interactionPolicy}
      loading={loading}
      onChange={setValues}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}

/***
 * Sign-in form pattern with identifier and password fields.
 *
 
 */
export const SignInForm = withZoraThemeScope(SignInFormInner);
