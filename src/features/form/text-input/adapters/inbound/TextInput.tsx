import * as Surface from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../../../../internal/recipes';
import { useZoraTheme } from '../../../../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../../../../theme/withZoraThemeScope';
import type { TextInputProps } from '../../../../../types/text-input';
import { IconButton } from '../../../../button/public';

function TextInputInner({
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
}: TextInputProps) {
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
 * Use `TextInput` for single-line, multiline, and password form controls with ZORA styling.
 *
 * @example Search input
 * ```tsx
 * <TextInput placeholder="Search" leadingIcon={{ name: 'search-outline' }} />
 * ```
 */
export const TextInput = withZoraThemeScope(TextInputInner);
