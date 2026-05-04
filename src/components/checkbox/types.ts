import type { CheckboxProps as SurfaceCheckboxProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface CheckboxProps
  extends ZoraBaseProps, Omit<SurfaceCheckboxProps, 'mode' | 'themeId'> {}

export interface CheckboxGroupOption<TValue extends string> {
  value: TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export interface CheckboxGroupProps<TValue extends string>
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceCheckboxProps, 'mode' | 'themeId'>,
      'tone' | 'size' | 'invalid' | 'readOnly' | 'disabled'
    > {
  value: readonly TValue[];
  onValueChange: (value: TValue[]) => void;
  options: readonly CheckboxGroupOption<TValue>[];
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 's' | 'm' | 'l';
}
