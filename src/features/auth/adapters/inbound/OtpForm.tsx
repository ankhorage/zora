import React from 'react';

import type { OtpFormProps } from '../../../../types/auth';
import type { FormFieldConfig, FormValues } from '../../../../types/form';
import { Button } from '../../../button/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { AuthForm } from './AuthForm';

type OtpFieldName = 'otp';

function OtpFormInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
      onSubmit?.({
        otp: formValues.otp.trim(),
      }),
    [onSubmit],
  );

  return (
    <AuthForm
      actions={
        onResend ? (
          <View direction="row" gap="s" wrap="wrap">
            <Button
              disabled={disabled || loading || resendDisabled}
              variant="ghost"
              loading={resendLoading}
              onPress={() => {
                void onResend();
              }}
              size="s"
              color="neutral"
              interactionPolicy={interactionPolicy}
            >
              {resendLabel}
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
 * One-time passcode form pattern with digit input and submit actions.
 *
 
 */
export const OtpForm = withZoraThemeScope(OtpFormInner);
