import type React from 'react';

import type { ZoraBaseProps } from './base';

export interface SectionHeaderProps extends ZoraBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface ScreenSectionProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
