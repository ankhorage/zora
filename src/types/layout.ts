import type {
  DividerProps as SurfaceDividerProps,
  GridProps as SurfaceGridProps,
  ScrollViewProps as SurfaceScrollViewProps,
  ViewProps as SurfaceViewProps,
} from '@ankhorage/surface';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface ViewProps extends ZoraBaseProps, Omit<SurfaceViewProps, 'mode' | 'themeId'> {}
export interface ScrollViewProps
  extends ZoraBaseProps, Omit<SurfaceScrollViewProps, 'mode' | 'themeId'> {}
export interface DividerProps
  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}
export interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}
