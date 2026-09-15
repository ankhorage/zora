import { Checkbox as SurfaceCheckbox } from '@ankhorage/surface';
import React from 'react';

import type { CheckboxProps } from '../../../../../types/checkbox';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';

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
