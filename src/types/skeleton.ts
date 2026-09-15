import type { ViewProps } from '../features/layout/public';
import type { ZoraBaseProps } from './base';

export type SkeletonRadius = ViewProps['radius'];
export type SkeletonDimension = ViewProps['width'];
export type SkeletonListVariant = 'divider' | 'card';

export interface SkeletonProps extends ZoraBaseProps {
  width?: SkeletonDimension;
  height?: ViewProps['height'];
  radius?: SkeletonRadius;
}

export interface SkeletonTextProps extends ZoraBaseProps {
  lines?: number;
  lineHeight?: number;
  gap?: ViewProps['gap'];
  width?: SkeletonDimension;
  lastLineWidth?: SkeletonDimension;
}

export interface SkeletonCardProps extends ZoraBaseProps {
  media?: boolean;
  actions?: boolean;
  lines?: number;
  compact?: boolean;
}

export interface SkeletonListProps extends ZoraBaseProps {
  rows?: number;
  avatar?: boolean;
  media?: boolean;
  lines?: number;
  variant?: SkeletonListVariant;
  compact?: boolean;
}
