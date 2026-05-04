import * as Surface from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { TextareaProps } from './types';

function TextareaInner({
  themeId: _themeId,
  mode: _mode,
  size = 'l',
  leadingIcon,
  trailingIcon,
  ...props
}: TextareaProps) {
  const { theme } = useZoraTheme();
  const iconSize = resolveIconSize(size);
  const iconColor = theme.semantics.content.muted;

  return (
    <Surface.Textarea
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

export const Textarea = withZoraThemeScope(TextareaInner);
