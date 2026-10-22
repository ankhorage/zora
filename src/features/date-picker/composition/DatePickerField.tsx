import type React from 'react';

import type { DatePickerProps } from '../../../types/date-picker';
import { PickerField } from '../../picker/composition/PickerField';

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
  return <PickerField {...{ children, description, disabled, error, label, required, testID }} />;
}

interface DatePickerFieldProps extends Pick<
  DatePickerProps,
  'description' | 'disabled' | 'error' | 'label' | 'required' | 'testID'
> {
  children: React.ReactNode;
}
