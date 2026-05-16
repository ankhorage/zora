import type { BoxProps, StackProps } from '../../foundation';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type SkeletonRadius = BoxProps['radius'];
export type SkeletonDimension = BoxProps['width'];
export type SkeletonListVariant = 'divider' | 'card';

export interface SkeletonProps extends ZoraBaseProps {
  width?: SkeletonDimension;
  height?: BoxProps['height'];
  radius?: SkeletonRadius;
}

export interface SkeletonTextProps extends ZoraBaseProps {
  lines?: number;
  lineHeight?: number;
  gap?: StackProps['gap'];
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
