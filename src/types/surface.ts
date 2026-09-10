import type { SurfaceProps as SurfaceSurfaceProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export type { SurfaceVariant } from '@ankhorage/surface';
export interface SurfaceProps
  extends ZoraBaseProps, Omit<SurfaceSurfaceProps, 'mode' | 'themeId'> {}
