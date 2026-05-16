import type React from 'react';

import type { StackProps } from '../../foundation';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ButtonGroupAlign = 'start' | 'center' | 'end' | 'stretch' | 'between';
export type ButtonGroupOrientation = 'horizontal' | 'vertical' | 'responsive';

export interface ButtonGroupProps extends ZoraBaseProps {
  children?: React.ReactNode;
  align?: ButtonGroupAlign;
  orientation?: ButtonGroupOrientation;
  gap?: StackProps['gap'];
  reverse?: boolean;
}
