import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface SettingsLayoutProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sidebar: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}
