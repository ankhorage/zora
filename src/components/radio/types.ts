import type { RadioProps as SurfaceRadioProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface RadioProps extends ZoraBaseProps, Omit<SurfaceRadioProps, 'mode' | 'themeId'> {}

export interface RadioGroupOption<TValue extends string> {
  value: TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export interface RadioGroupProps<TValue extends string>
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceRadioProps, 'mode' | 'themeId'>,
      'tone' | 'size' | 'invalid' | 'readOnly' | 'disabled'
    > {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: readonly RadioGroupOption<TValue>[];
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 's' | 'm' | 'l';
}
