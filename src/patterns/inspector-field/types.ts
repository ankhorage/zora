import type { ReactNode } from 'react';

export interface InspectorFieldProps {
  label: ReactNode;
  description?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  control?: ReactNode;
  children?: ReactNode;
  testID?: string;
}
