import type React from 'react';

import type { ZoraCardTone } from '../../internal/recipes';

export interface PanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  testID?: string;
}
