import type { CardProps as SurfaceCardProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraCardTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface CardProps
  extends ZoraBaseProps, Omit<SurfaceCardProps, 'children' | 'p' | 'radius' | 'variant'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: