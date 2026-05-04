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
      emphasis={active ? 'soft' : 'ghost'}
      tone={active ? 'primary' : 'neutral'}
      size="m"
    />
  );
}

export const ToolbarAction = withZoraThemeScope(ToolbarActionInner);
