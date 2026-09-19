import { Icon as SurfaceIcon, TextInput as SurfaceTextInput } from '@ankhorage/surface';
import React from 'react';

import type { TextInputProps } from '../../../../../types/text-input';
import { IconButton } from '../../../../button/public';
import { resolveIconSize } from '../../../../icon/utils/resolveIconSize';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../../theme/composition/useZoraTheme';

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
    <SurfaceTextInput
      {...props}
      disabled={disabled}
      interactionPolicy={interactionPolicy}
      leadingAccessory={
        leadingIcon ? <SurfaceIcon {...leadingIcon} color={iconColor} size={iconSize} /> : undefined
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
          <SurfaceIcon {...trailingIcon} color={iconColor} size={iconSize} />
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
