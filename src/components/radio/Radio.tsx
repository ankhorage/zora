import { Radio as SurfaceRadio } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { RadioProps } from './types';

function RadioInner({ themeId: _themeId, mode: _mode, interactionPolicy, ...props }: RadioProps) {
  return <SurfaceRadio {...props} interactionPolicy={interactionPolicy} />;
}

/***
 * Single-choice selection control used within a radio group.
 */
export const Radio = withZoraThemeScope(RadioInner);
