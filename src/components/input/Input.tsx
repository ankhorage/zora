import * as Surface from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { IconButton } from '../icon-button';
import type { InputProps } from './types';

function InputInner({
  themeId: _themeId,
  mode: _mode,
  size = 'l',
  leadingIcon,
  trailingIcon,
  trailingAction,
  disabled,
  readOnly,
  interactionPolicy,
  ...props
}: InputProps) {
  const { theme } = useZoraTheme();
  const iconSize = resolveIconSize(size);
  const iconColor = theme.semantics.content.muted;

  return (
    <Surface.TextInput
      {...props}
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      leadingAccessory={
        leadingIcon ? (
          <Surface.Icon {...leadingIcon} color={iconColor} size={iconSize} />
        ) : undefined
      }
      readOnly={readOnly}
      size={size}
      trailingAccessory={
        trailingAction ? (
          <IconButton
            icon={trailingAction.icon}
            interactionPolicy={interactionPolicy}
            label={trailingAction.label}
            disabled={disabled ?? readOnly}
            variant="ghost"
            size={size === 'l' ? 'm' : size}
            color="neutral"
            onPress={trailingAction.onPress}
          />
        ) : trailingIcon ? (
          <Surface.Icon {...trailingIcon} color={iconColor} size={iconSize} />
        ) : undefined
      }
    />
  );
}

/***
 * Theme-aware text input with semantic sizing and optional leading/trailing icon slots.
 *
 * Use `Input` for single-line form controls that need ZORA styling, disabled/read-only
 * handling, and accessible trailing actions without dropping into Surface directly.
 *
 * @example Search input
 * ```tsx
 * <Input placeholder="Search" leadingIcon={{ name: 'search-outline' }} />
 * ```
 */
export const Input = withZoraThemeScope(InputInner);
