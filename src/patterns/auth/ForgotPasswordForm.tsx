import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Button } from '../../components/button';
import { Form, type FormFieldConfig, type FormValues } from '../../components/form';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ForgotPasswordFormProps } from './types';
import {
  defaultIdentifiers,
  normalizeIdentifierKind,
  resolveIdentifierLabel,
  resolveIdentifierRules,
  resolveIdentifierType,
} from './utils';

type ForgotPasswordFieldName = 'identifier';

function ForgotPasswordFormInner({
  themeId: _themeId,
  mode: _mode,
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
      onSubmit({
        identifier: formValues.identifier.trim(),
        identifierKind: normalizeIdentifierKind(formValues.identifier, identifiers),
      }),
    [identifiers, onSubmit],
  );

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
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      testID={testID}
      values={values}
    />
  );
}

export const ForgotPasswordForm = withZoraThemeScope(ForgotPasswordFormInner);
