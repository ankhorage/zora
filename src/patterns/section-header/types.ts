import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface SectionHeaderProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}
