import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface AuthLayoutProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}
