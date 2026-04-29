import type { RadioProps } from '@ankhorage/surface';
import type React from 'react';

export interface RadioGroupOption<TValue extends string> {
  value: TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export interface RadioGroupProps<TValue extends string> extends Pick<
  RadioProps,
  'tone' | 'size' | 'invalid' | 'readOnly' | 'disabled' | 'testID'
> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: readonly RadioGroupOption<TValue>[];
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 's' | 'm' | 'l';
}
