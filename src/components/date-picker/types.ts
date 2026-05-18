import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type DatePickerValue = Date | null;

export interface DatePickerProps extends ZoraBaseProps {
  value: DatePickerValue;
  onValueChange?: (value: DatePickerValue) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: React.ReactNode;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  formatDate?: (value: Date) => React.ReactNode;
  testID?: string;
}
