import type React from 'react';

import type { GridProps } from '../../foundation';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ScreenSectionProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  columns?: GridProps['cols'];
  gap?: GridProps['gap'];
  minItemWidth?: GridProps['minItemWidth'];
}
