import { Field } from '@ankhorage/surface';
import type React from 'react';

import type { DatePickerProps } from '../../../types/date-picker';
import { View } from '../../layout/public';
import { Text } from '../../typography/public';

/*** Renders the shared DatePicker field frame around a platform-specific trigger. */
export function DatePickerField({
  children,
  description,
  disabled,
  error,
  label,
  required,
  testID,
}: DatePickerFieldProps) {
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

interface DatePickerFieldProps extends Pick<
  DatePickerProps,
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
