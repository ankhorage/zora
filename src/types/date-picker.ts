import type React from 'react';

import type { ZoraBaseProps } from './base';

export type DatePickerValue = string | null;

export interface DatePickerProps extends ZoraBaseProps {
  value: DatePickerValue;
  onValueChange?: (value: DatePickerValue) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: React.ReactNode;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  required?: boolean;
  formatDate?: (value: string) => React.ReactNode;
  testID?: string;
}
