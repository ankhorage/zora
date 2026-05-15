import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';
import React from 'react';
import { Image } from 'react-native';

import { Box } from '../../foundation';
import type { ZoraColor } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import { Text, type TextColor, type TextVariant } from '../text';
import { resolveAvatarInitials } from './resolveAvatarInitials';
import type { AvatarProps, AvatarShape, AvatarSize } from './types';

const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs: 24,
  s: 32,
  m: 40,
  l: 48,
  xl: 64,
};

function resolveRoleSemantics(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
  switch (color) {
    case 'primary':
      return theme.semantics.action.primary;
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'danger':
    case 'error':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'info':
      return theme.semantics.secondary;
    case 'neutral':
    default:
      return theme.semantics.action.neutral;
  }
}

function resolveTextColor(color: ZoraColor): TextColor {
  return color === 'neutral' ? 'default' : color;
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
  const resolvedSize = AVATAR_SIZES[size];
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

export const Avatar = withZoraThemeScope(AvatarInner);
