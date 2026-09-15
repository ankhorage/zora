import { Tabs as SurfaceTabs } from '@ankhorage/surface';

import type { TabsProps } from '../../../../types/tabs';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { TabsInteractionPolicyContext } from '../../composition/TabsInteractionPolicyContext';

/*** Provides accessible tab state and interaction policy through the Surface Tabs primitive. */
export const Tabs = withZoraThemeScope(TabsInner);

/*** Connects ZORA tab composition to the Surface tab state owner. */
function TabsInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy = 'enabled',
  children,
  ...props
}: TabsProps) {
  return (
    <TabsInteractionPolicyContext value={interactionPolicy}>
      <SurfaceTabs {...props}>{children}</SurfaceTabs>
    </TabsInteractionPolicyContext>
  );
}
