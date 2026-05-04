import type React from 'react';

import type { ZoraContentWidth } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface PageProps extends ZoraBaseProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
}
