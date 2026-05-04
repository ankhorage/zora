import { Checkbox as SurfaceCheckbox } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { CheckboxProps } from './types';

function CheckboxInner({ themeId: _themeId, mode: _mode, ...props }: CheckboxProps) {
  return <SurfaceCheckbox {...props} />;
}

export const Checkbox = withZoraThemeScope(CheckboxInner);
