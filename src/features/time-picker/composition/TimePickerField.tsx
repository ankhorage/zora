import { Field } from '@ankhorage/surface';
import type React from 'react';

import type { TimePickerProps } from '../../../types/time-picker';
import { View } from '../../layout/public';
import { Text } from '../../typography/public';

/*** Renders the shared TimePicker field frame around a platform-specific trigger. */
export function TimePickerField({
  children,
  description,
  disabled,
  error,
  label,
  required,
  testID,
}: TimePickerFieldProps) {
  return (
    <Field
      disabled={disabled}
      errorText={error}
      invalid={Boolean(error)}
      label={label ? renderLabel(label, description) : undefined}
      required={required}
      testID={testID}
    >
      {children}
    </Field>
  );
}

interface TimePickerFieldProps extends Pick<
  TimePickerProps,
  'description' | 'disabled' | 'error' | 'label' | 'required' | 'testID'
> {
  children: React.ReactNode;
}

/*** Renders the picker label and optional supporting description. */
function renderLabel(label: React.ReactNode, description: React.ReactNode | undefined) {
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
