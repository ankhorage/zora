import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface SidebarLayoutProps extends ZoraBaseProps {
  sidebar: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  sidebarWidth?: number;
  asideWidth?: number;
}
