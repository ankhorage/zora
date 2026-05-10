import type { ImageProps as SurfaceImageProps } from '@ankhorage/surface';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type { ImageFit, SurfaceImageSource } from '@ankhorage/surface';

export interface ImageProps extends ZoraBaseProps, Omit<SurfaceImageProps, 'mode' | 'themeId'> {}
