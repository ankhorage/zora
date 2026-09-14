import type React from 'react';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface ToolbarProps extends ZoraBaseProps {
  children?: React.ReactNode;
  floating?: boolean;
  compact?: boolean;
}
