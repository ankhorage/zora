import { Stack } from '@ankhorage/surface';
import React from 'react';

import { Card } from '../card';
import type { ToolbarProps } from './types';

export function Toolbar({
  children,
  position = 'inline',
  floating = false,
  compact = true,
  testID,
}: ToolbarProps) {
  const isFixed = position === 'top' || position === 'bottom';

  return (
    <Card
      compact={compact}
      tone={floating ? 'default' : 'subtle'}
      testID={testID}
      style={
        isFixed
          ? {
              position: 'absolute',
              left: 0,
              right: 0,
              [position]: 0,
              zIndex: 10,
            }
          : undefined
      }
    >
      <Stack direction="row" gap="s" align="center">
        {children}
      </Stack>
    </Card>
  );
}
