import type { ReactNode } from 'react';

export interface SwitchFieldProps {
  label: ReactNode;
  description?: ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
}
