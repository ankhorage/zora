import { Checkbox as SurfaceCheckbox } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { CheckboxProps } from './types';

function CheckboxInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  ...props
}: CheckboxProps) {
  return <SurfaceCheckbox {...props} interactionPolicy={interactionPolicy} />;
}

/***
 * Binary selection control for toggling a value on or off.
 *
 
 */
export const Checkbox = withZoraThemeScope(CheckboxInner);
