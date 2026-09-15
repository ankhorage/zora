import type { CardProps as SurfaceCardProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type ZoraCardTone = 'default' | 'subtle' | 'outline';

export interface CardProps
  extends ZoraBaseProps, Omit<SurfaceCardProps, 'children' | 'p' | 'radius' | 'variant'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  padding?: string;
  radius?: string;
}
