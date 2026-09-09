import type {
  ImageProps as SurfaceImageProps,
  SurfaceImageSource,
} from '@ankhorage/surface';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { UploadAsset } from '../../types/upload';

export type { ImageFit, SurfaceImageSource } from '@ankhorage/surface';

export interface ImageProps
  extends ZoraBaseProps,
    Omit<SurfaceImageProps, 'mode' | 'source' | 'themeId'> {
  source?: SurfaceImageSource | UploadAsset | null;
}
