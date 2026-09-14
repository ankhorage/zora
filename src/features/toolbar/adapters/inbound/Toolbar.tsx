import React from 'react';

import { Card } from '../../../card/public';
import { Stack } from '../../../layout/public';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ToolbarProps } from '../../../../types/toolbar';

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
      <Stack align="center" direction="row" gap="s">
        {children}
      </Stack>
    </Card>
  );
}
