import type React from 'react';

import type { ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface NoticeProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  color?: ZoraColor;
}
