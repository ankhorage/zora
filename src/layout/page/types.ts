import type React from 'react';

import type { ZoraContentWidth } from '../../internal/recipes';

export interface PageProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
  testID?: string;
}
