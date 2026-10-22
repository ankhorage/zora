import type React from 'react';

import type { TimePickerProps } from '../../../types/time-picker';
import { PickerField } from '../../picker/composition/PickerField';

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
  return <PickerField {...{ children, description, disabled, error, label, required, testID }} />;
}

interface TimePickerFieldProps extends Pick<
  TimePickerProps,
  'description' | 'disabled' | 'error' | 'label' | 'required' | 'testID'
> {
  children: React.ReactNode;
}
