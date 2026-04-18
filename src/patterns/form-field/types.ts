import type { FieldProps as SurfaceFieldProps } from '@ankhorage/surface';
import type React from 'react';

export interface FormFieldProps extends Pick<
  SurfaceFieldProps,
  'children' | 'disabled' | 'errorText' | 'invalid' | 'readOnly' | 'required' | 'testID'
> {
  label: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
}
