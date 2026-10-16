import type {
  DividerProps as SurfaceDividerProps,
  GridProps as SurfaceGridProps,
  ScrollViewProps as SurfaceScrollViewProps,
  ViewProps as SurfaceViewProps,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export type ZoraContentWidth = 'narrow' | 'default' | 'wide';

export interface ViewProps extends ZoraBaseProps, Omit<SurfaceViewProps, 'mode' | 'themeId'> {}
export interface ScrollViewProps
  extends ZoraBaseProps, Omit<SurfaceScrollViewProps, 'mode' | 'themeId'> {}
export interface DividerProps
  extends ZoraBaseProps, Omit<SurfaceDividerProps, 'mode' | 'themeId'> {}
export interface GridProps extends ZoraBaseProps, Omit<SurfaceGridProps, 'mode' | 'themeId'> {}

export interface AppShellProps extends ZoraBaseProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
}

export interface ScreenProps extends ZoraBaseProps {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  width?: ZoraContentWidth;
}

/** Exclusive-gesture coordination between a ZORA scroll container and its descendant surfaces. */
export interface ScrollGestureLock {
  /** Suspends scrolling until the returned release function runs; releasing twice is harmless. */
  readonly acquire: () => () => void;
}
