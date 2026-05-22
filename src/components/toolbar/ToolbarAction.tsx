import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { IconButton } from '../icon-button';
import type { ToolbarActionProps } from './types';

function ToolbarActionInner({
  themeId: _themeId,
  mode: _mode,
  active,
  ...props
}: ToolbarActionProps) {
  return (
    <IconButton
      {...props}
      variant={active ? 'soft' : 'ghost'}
      color={active ? 'primary' : 'neutral'}
      size="m"
    />
  );
}

/***
 * Convenience icon action for toolbars with active state styling.
 *
 
 */
export const ToolbarAction = withZoraThemeScope(ToolbarActionInner);
