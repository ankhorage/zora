import { Radio as SurfaceRadio } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { RadioProps } from './types';

function RadioInner({ themeId: _themeId, mode: _mode, ...props }: RadioProps) {
  return <SurfaceRadio {...props} />;
}

export const Radio = withZoraThemeScope(RadioInner);
