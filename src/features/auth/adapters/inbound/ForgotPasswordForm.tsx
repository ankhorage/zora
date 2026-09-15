import React from 'react';

import type { ForgotPasswordFormProps } from '../../../../types/auth';
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

type ForgotPasswordFieldName = 'identifier';

function ForgotPasswordFormInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  identifiers = defaultIdentifiers,
  identifierLabel,
  signInLabel = 'Sign in',
  loading = false,
  disabled = false,
  error,
  submitLabel = 'Send code',
  onSubmit,
  onSignIn,
  testID,
}: ForgotPasswordFormProps) {
  const [values, setValues] = React.useState<FormValues<ForgotPasswordFieldName>>({
    identifier: '',
  });
  const fields = React.useMemo<readonly FormFieldConfig<ForgotPasswordFieldName>[]>(
    () => [
      {
        name: 'identifier',
        label: identifierLabel ?? resolveIdentifierLabel(identifiers),
        type: resolveIdentifierType(identifiers),
        autoCapitalize: 'none',
        rules: resolveIdentifierRules(identifiers),
      },
    ],
    [identifierLabel, identifiers],
  );

  const handleSubmit = React.useCallback(
    (formValues: FormValues<ForgotPasswordFieldName>) =>
      onSubmit?.({
        identifier: formValues.identifier.trim(),
        identifierKind: normalizeIdentifierKind(formValues.identifier, identifiers),
      }),
    [identifiers, onSubmit],
  );

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
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}

/***
 * Password reset form pattern with validation and submit actions.
 *
 
 */
export const ForgotPasswordForm = withZoraThemeScope(ForgotPasswordFormInner);
