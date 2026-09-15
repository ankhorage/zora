import { Tab as SurfaceTab } from '@ankhorage/surface';
import React from 'react';

import type { TabProps } from '../../../../types/tabs';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { TabsInteractionPolicyContext } from '../../composition/TabsInteractionPolicyContext';

/*** Renders one labeled selectable tab backed by Surface accessibility semantics. */
export const Tab = withZoraThemeScope(TabInner);

/*** Resolves inherited interaction policy before delegating tab behavior to Surface. */
function TabInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  label,
  ...props
}: TabProps) {
  const inheritedInteractionPolicy = React.use(TabsInteractionPolicyContext);

  return (
    <SurfaceTab {...props} interactionPolicy={interactionPolicy ?? inheritedInteractionPolicy}>
      {label}
    </SurfaceTab>
  );
}
