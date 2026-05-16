import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

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
