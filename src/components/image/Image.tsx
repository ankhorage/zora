import { Image as SurfaceImage } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ImageProps } from './types';

function ImageInner({ themeId: _themeId, mode: _mode, ...props }: ImageProps) {
  return <SurfaceImage {...props} />;
}

export const Image = withZoraThemeScope(ImageInner);
