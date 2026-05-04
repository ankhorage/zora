import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface PageSectionProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
