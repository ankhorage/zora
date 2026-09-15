import { Switch as SurfaceSwitch } from '@ankhorage/surface';
import React from 'react';

import type { SwitchProps } from '../../../../../types/switch';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';

/*** Renders the ZORA switch while preserving the canonical Surface switch contract. */
export const Switch = withZoraThemeScope(SwitchInner);

function SwitchInner({ themeId: _themeId, mode: _mode, interactionPolicy, ...props }: SwitchProps) {
  return <SurfaceSwitch {...props} interactionPolicy={interactionPolicy} />;
}
