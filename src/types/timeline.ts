import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ZoraColor } from './theme';

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: ZoraColor;
  icon?: ButtonIconSpec;
  testID?: string;
}

export interface TimelineProps extends ZoraBaseProps {
  items: readonly TimelineItem[];
  compact?: boolean;
}
