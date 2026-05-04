import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface TopbarLayoutProps extends ZoraBaseProps {
  topbar: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
}
