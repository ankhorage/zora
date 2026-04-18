import { Icon, Textarea as SurfaceTextarea, useTheme } from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../internal/recipes';
import type { TextareaProps } from './types';

export function Textarea({ size = 'l', leadingIcon, trailingIcon, ...props }: TextareaProps) {
  const { theme } = useTheme();
  const iconSize = resolveIconSize(size);
  const iconColor = theme.semantics.content.muted;

  return (
    <SurfaceTextarea
      {...props}
      leadingAccessory={
        leadingIcon ? (
          <Icon
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
          <Icon
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
