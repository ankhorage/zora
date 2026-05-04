import type { FieldProps as SurfaceFieldProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface FormFieldProps
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceFieldProps, 'mode' | 'themeId'>,
      'children' | 'disabled' | 'errorText' | 'invalid' | 'readOnly' | 'required'
    > {
  label: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
}
