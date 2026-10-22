import { Field } from '@ankhorage/surface';
import type React from 'react';

import { View } from '../../layout/public';
import { Text } from '../../typography/public';

/*** Renders the common field frame and label treatment for picker controls. */
export function PickerField({
  children,
  description,
  disabled,
  error,
  label,
  required,
  testID,
}: PickerFieldProps) {
  return (
    <Field
      disabled={disabled}
      errorText={error}
      invalid={Boolean(error)}
      label={label ? <PickerFieldLabel description={description} label={label} /> : undefined}
      required={required}
      testID={testID}
    >
      {children}
    </Field>
  );
}

interface PickerFieldProps {
  readonly children: React.ReactNode;
  readonly description: React.ReactNode | undefined;
  readonly disabled: boolean | undefined;
  readonly error: React.ReactNode | undefined;
  readonly label: React.ReactNode | undefined;
  readonly required: boolean | undefined;
  readonly testID: string | undefined;
}

/*** Renders a picker field label and its optional supporting description. */
function PickerFieldLabel({
  description,
  label,
}: {
  readonly description: React.ReactNode | undefined;
  readonly label: React.ReactNode;
}) {
  return (
    <View gap="xs">
      <Text variant="label" weight="semiBold">
        {label}
      </Text>
      {description ? (
        <Text emphasis="muted" variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
