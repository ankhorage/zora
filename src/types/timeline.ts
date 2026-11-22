import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ImageProps } from './image';
import type { ZoraColor } from './theme';

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: ZoraColor;
  icon?: ButtonIconSpec;
  marker?: ImageProps['source'];
  markerAlt?: string;
  testID?: string;
}

export interface TimelineProps extends ZoraBaseProps {
  items: readonly TimelineItem[];
  compact?: boolean;
}
