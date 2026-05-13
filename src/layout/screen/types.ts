import type React from 'react';

import type { ZoraContentWidth } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ScreenProps extends ZoraBaseProps {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  width?: ZoraContentWidth;
}
