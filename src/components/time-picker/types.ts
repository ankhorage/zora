import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type TimePickerValue = string | null;

export interface TimePickerProps extends ZoraBaseProps {
  value: TimePickerValue;
  onValueChange?: (value: TimePickerValue) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: React.ReactNode;
  minTime?: string;
  maxTime?: string;
  stepMinutes?: number;
  disabled?: boolean;
  required?: boolean;
  formatTime?: (value: string) => React.ReactNode;
  testID?: string;
}
