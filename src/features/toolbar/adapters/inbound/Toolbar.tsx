import type { ToolbarProps } from '../../../../types/toolbar';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Renders a visible horizontal group of contextual actions and controls. */
export const Toolbar = withZoraThemeScope(ToolbarInner);

/*** Applies toolbar presentation without owning page placement. */
function ToolbarInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  children,
  floating = false,
  compact = true,
  testID,
}: ToolbarProps) {
  return (
    <Card
      compact={compact}
      interactionPolicy={interactionPolicy}
      tone={floating ? 'default' : 'subtle'}
      testID={testID}
    >
      <View align="center" direction="row" gap="s">
        {children}
      </View>
    </Card>
  );
}
