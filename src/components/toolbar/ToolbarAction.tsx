import React from 'react';

import { IconButton } from '../icon-button';
import type { ToolbarActionProps } from './types';

export function ToolbarAction({ active, ...props }: ToolbarActionProps) {
  return (
    <IconButton
      {...props}
      emphasis={active ? 'soft' : 'ghost'}
      tone={active ? 'primary' : 'neutral'}
      size="m"
    />
  );
}
