import type { SurfaceProps as SurfaceSurfaceProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export type { SurfaceVariant } from '@ankhorage/surface';
export interface SurfaceProps
  extends ZoraBaseProps, Omit<SurfaceSurfaceProps, 'mode' | 'themeId'> {}
