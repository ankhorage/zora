import type { CheckboxProps } from '@ankhorage/surface';
import type React from 'react';

export interface CheckboxGroupOption<TValue extends string> {
  value: TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export interface CheckboxGroupProps<TValue extends string> extends Pick<
  CheckboxProps,
  'tone' | 'size' | 'invalid' | 'readOnly' | 'disabled' | 'testID'
> {
  value: readonly TValue[];
  onValueChange: (value: TValue[]) => void;
  options: readonly CheckboxGroupOption<TValue>[];
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 's' | 'm' | 'l';
}
