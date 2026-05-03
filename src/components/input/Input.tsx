import * as Surface from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../internal/recipes';
import type { InputProps } from './types';

export function Input({ size = 'l', leadingIcon, trailingIcon, ...props }: InputProps) {
  const { theme } = Surface.useTheme();
  const iconSize = resolveIconSize(size);
  const iconColor = theme.semantics.content.muted;

  return (
    <Surface.TextInput
      {...props}
      leadingAccessory={
        leadingIcon ? (
          <Surface.Icon
            color={iconColor}
            name={leadingIcon.name}
            provider={leadingIcon.provider}
            size={iconSize}
          />
        ) : undefined
      }
      size={size}
      trailingAccessory={
        trailingIcon ? (
          <Surface.Icon
            color={iconColor}
            name={trailingIcon.name}
            provider={trailingIcon.provider}
            size={iconSize}
          />
        ) : undefined
      }
    />
  );
}
