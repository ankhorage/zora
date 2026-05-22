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
  ...props
}: InputProps) {
  const { theme } = useZoraTheme();
  const iconSize = resolveIconSize(size);
  const iconColor = theme.semantics.content.muted;

  return (
    <Surface.TextInput
      {...props}
      disabled={disabled}
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
      readOnly={readOnly}
      size={size}
      trailingAccessory={
        trailingAction ? (
          <IconButton
            icon={trailingAction.icon}
            label={trailingAction.label}
            disabled={disabled ?? readOnly}
            variant="ghost"
            size={size === 'l' ? 'm' : size}
            color="neutral"
            onPress={trailingAction.onPress}
          />
        ) : trailingIcon ? (
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

/***
 * Theme-aware text input with semantic sizing and optional leading/trailing icon slots.
 *
 * Use `Input` for single-line form controls that need ZORA styling, disabled/read-only
 * handling, and accessible trailing actions without dropping into Surface directly.
 *
 * @readme
 * @example Search input
 * ```tsx
 * <Input placeholder="Search" leadingIcon={{ name: 'search-outline' }} />
 * ```
 */
export const Input = withZoraThemeScope(InputInner);
