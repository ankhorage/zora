import type React from 'react';

import type { ViewProps } from '../features/layout/public';
import type { ZoraBaseProps } from './base';

export type ButtonGroupAlign = 'start' | 'center' | 'end' | 'stretch' | 'between';
export type ButtonGroupOrientation = 'horizontal' | 'vertical' | 'responsive';

export interface ButtonGroupProps extends ZoraBaseProps {
  children?: React.ReactNode;
  align?: ButtonGroupAlign;
  orientation?: ButtonGroupOrientation;
  gap?: ViewProps['gap'];
  reverse?: boolean;
}
