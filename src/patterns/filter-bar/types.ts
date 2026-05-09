import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface FilterBarProps extends ZoraBaseProps {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  wrap?: boolean;
}
