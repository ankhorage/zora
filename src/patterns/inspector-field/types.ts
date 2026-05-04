import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface InspectorFieldProps extends ZoraBaseProps {
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
}
