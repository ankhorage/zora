import type { RadioProps as SurfaceRadioProps } from '@ankhorage/surface';
import type React from 'react';

import type { IconProps } from '../../features/icon/public';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface RadioProps extends ZoraBaseProps, Omit<SurfaceRadioProps, 'mode' | 'themeId'> {}

export interface RadioGroupOption<TValue extends string> {
  value: TValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** SVG media is resolved by the consuming runtime before rendering. */
  iconSource?: Extract<IconProps, { source: unknown }>['source'];
  disabled?: boolean;
  testID?: string;
}

export interface RadioGroupProps<TValue extends string>
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceRadioProps, 'mode' | 'themeId'>,
      'color' | 'size' | 'invalid' | 'readOnly' | 'disabled'
    > {
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;
  options: readonly RadioGroupOption<TValue>[];
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 's' | 'm' | 'l';
  presentation?: 'inline' | 'card';
  /** Arrangement inside a selection card, independent of the group direction. */
  contentOrientation?: 'horizontal' | 'vertical';
  /** Equal-width card columns; omitted columns follow orientation. */
  columns?: 1 | 2 | 3 | 4;
}
