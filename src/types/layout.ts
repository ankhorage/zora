import type {
  BoxProps as SurfaceBoxProps,
  ContainerProps as SurfaceContainerProps,
  DividerProps as SurfaceDividerProps,
  GridProps as SurfaceGridProps,
  StackProps as SurfaceStackProps,
} from '@ankhorage/surface';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface BoxProps extends ZoraBaseProps, Omit<SurfaceBoxProps, 'mode' | 'themeId'> {}
export interface ContainerProps
  extends ZoraBaseProps, Omit<SurfaceContainerProps, 'mode' | 'themeId'> {}
export interface DividerProps
  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}
export interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}
export interface StackProps extends ZoraBaseProps, Omit<SurfaceStackProps, 'mode' | 'themeId'> {}
