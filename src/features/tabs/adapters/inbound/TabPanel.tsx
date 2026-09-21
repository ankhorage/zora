import { TabPanel as SurfaceTabPanel } from '@ankhorage/surface';

import type { TabPanelProps } from '../../../../types/tabs';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Renders content associated with one selected Tab. */
export const TabPanel = withZoraThemeScope(TabPanelInner);

/*** Delegates tabpanel visibility and accessibility linkage to Surface. */
function TabPanelInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: TabPanelProps) {
  return <SurfaceTabPanel {...props} />;
}
