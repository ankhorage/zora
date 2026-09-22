import { TabList as SurfaceTabList } from '@ankhorage/surface';

import type { TabListProps } from '../../../../types/tabs';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Renders the accessible list of tabs for a Tabs composition. */
export const TabList = withZoraThemeScope(TabListInner);

/*** Delegates tablist semantics, keyboard navigation, and fill distribution to Surface. */
function TabListInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: TabListProps) {
  return <SurfaceTabList {...props} />;
}
