import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ViewProps } from './layout';

export type ButtonGroupAlign = 'start' | 'center' | 'end' | 'stretch' | 'between';
export type ButtonGroupOrientation = 'horizontal' | 'vertical' | 'responsive';

export interface ButtonGroupProps extends ZoraBaseProps {
  children?: React.ReactNode;
  align?: ButtonGroupAlign;
  orientation?: ButtonGroupOrientation;
  gap?: ViewProps['gap'];
  reverse?: boolean;
}
