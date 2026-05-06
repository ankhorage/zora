import React from 'react';

import { Button } from '../../components/button';
import { Form, type FormFieldConfig, type FormValues } from '../../components/form';
import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { OtpFormProps } from './types';

type OtpFieldName = 'otp';

function OtpFormInner({
  themeId: _themeId,
  mode: _mode,
  length = 6,
  otpLabel = 'Code',
  resendLabel = 'Resend code',
  resendDisabled = false,
  resendLoading = false,
  loading = false,
  disabled = false,
  error,
  submitLabel = 'Verify code',
  onSubmit,
  onResend,
  testID,
}: OtpFormProps) {
  const resolvedLength = Math.max(1, length);
  const [values, setValues] = React.useState<FormValues<OtpFieldName>>({
    otp: '',
  });
  const fields = React.useMemo<readonly FormFieldConfig<OtpFieldName>[]>(
    () => [
      {
        name: 'otp',
        label: otpLabel,
        type: 'otp',
        maxLength: resolvedLength,
        rules: [{ kind: 'required' }, { kind: 'minLength', value: resolvedLength }],
      },
    ],
    [otpLabel, resolvedLength],
  );

  const handleSubmit = React.useCallback(
    (formValues: FormValues<OtpFieldName>) =>
      onSubmit({
        otp: formValues.otp.trim(),
      }),
    [onSubmit],
  );

  return (
    <Form
      actions={
        onResend ? (
          <Stack direction="row" gap="s" wrap="wrap">
            <Button
              disabled={disabled || loading || resendDisabled}
              emphasis="ghost"
              loading={resendLoading}
              onPress={() => {
                void onResend();
              }}
              size="s"
              tone="neutral"
            >
              {resendLabel}
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

export const OtpForm = withZoraThemeScope(OtpFormInner);
