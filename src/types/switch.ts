import type { SwitchProps as SurfaceSwitchProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export interface SwitchProps extends ZoraBaseProps, Omit<SurfaceSwitchProps, 'mode' | 'themeId'> {}
