import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';
import React from 'react';
import { Image } from 'react-native';

import { Box } from '../../foundation';
import type { ZoraColor } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import { Text, type TextVariant } from '../text';
import { resolveAvatarInitials } from './resolveAvatarInitials';
import type { AvatarProps, AvatarShape, AvatarSize } from './types';

function resolveAvatarSize(size: AvatarSize): number {
  switch (size) {
    case 'xs':
      return 24;
    case 's':
      return 32;
    case 'l':
      return 48;
    case 'xl':
      return 64;
    case 'm':
    default:
      return 40;
  }
}

function resolveRoleSemantics(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'primary':
      return theme.semantics.action.primary;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'danger':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'neutral':
    default:
      return theme.semantics.action.neutral;
  }
}

function resolveTextColor(color: ZoraColor): ZoraColor | undefined {
  return color === 'neutral' ? undefined : color;
}

function resolveTextVariant(size: AvatarSize): TextVariant {
  switch (size) {
    case 'xs':
    case 's':
      return 'caption';
    case 'l':
      return 'bodySmall';
    case 'xl':
      return 'lead';
    case 'm':
    default:
      return 'label';
  }
}

function resolveRadius(shape: AvatarShape): 'full' | 'l' {
  return shape === 'circle' ? 'full' : 'l';
}

function AvatarInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  source,
  name,
  initials,
  iconFallback,
  label,
  size = 'm',
  shape = 'circle',
  color = 'neutral',
}: AvatarProps) {
  const { theme } = useZoraTheme();
  const resolvedSize = resolveAvatarSize(size);
  const resolvedInitials = initials ?? resolveAvatarInitials(name);
  const role = resolveRoleSemantics(theme, color);
  const backgroundColor = color === 'neutral' ? theme.semantics.neutral.surface : role.softBg;
  const contentColor = color === 'neutral' ? theme.semantics.content.default : role.base;
  const radius = resolveRadius(shape);

  const renderFallback = () => {
    if (resolvedInitials) {
      return (
        <Text color={resolveTextColor(color)} variant={resolveTextVariant(size)} weight="semiBold">
          {resolvedInitials}
        </Text>
      );
    }

    if (iconFallback) {
      const iconSize = Math.max(16, Math.round(resolvedSize * 0.48));
      return (
        <Icon
          color={contentColor}
          name={iconFallback.name}
          provider={iconFallback.provider}
          size={iconSize}
        />
      );
    }

    return null;
  };

  return (
    <Box
      accessibilityLabel={label}
      bg={backgroundColor}
      height={resolvedSize}
      radius={radius}
      testID={testID}
      width={resolvedSize}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {source ? (
        <Image
          accessibilityLabel={label}
          source={source}
          style={{ height: '100%', width: '100%' }}
        />
      ) : (
        renderFallback()
      )}
    </Box>
  );
}

/***
 * Displays a user or entity avatar with image support and initials fallback.
 */
export const Avatar = withZoraThemeScope(AvatarInner);
