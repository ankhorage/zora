import type { SwitchProps as SurfaceSwitchProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface SwitchProps extends ZoraBaseProps, Omit<SurfaceSwitchProps, 'mode' | 'themeId'> {}
