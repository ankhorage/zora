import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { ZoraColor } from '../../internal/recipes';
import type { ChipColors, ChipInteractionState } from './types';

function resolveChipRole(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'primary':
      return theme.semantics.action.primary;
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

export function resolveChipColors({
  theme,
  color,
  selected,
  state,
}: {
  theme: SurfaceTheme;
  color: ZoraColor;
  selected: boolean;
  state: ChipInteractionState;
}): ChipColors {
  if (state.disabled) {
    return {
      backgroundColor: theme.semantics.neutral.surface,
      borderColor: theme.semantics.neutral.divider,
      contentColor: theme.semantics.content.muted,
      opacity: 0.72,
    };
  }

  const role = resolveChipRole(theme, color);

  if (selected) {
    return {
      backgroundColor: state.pressed
        ? role.softActive
        : state.hovered
          ? role.softHover
          : role.softBg,
      borderColor: 'transparent',
      contentColor: role.base,
    };
  }

  return {
    backgroundColor: state.pressed
      ? theme.semantics.neutral.surfaceActive
      : state.hovered
        ? theme.semantics.neutral.surfaceHover
        : theme.semantics.neutral.surface,
    borderColor: theme.semantics.neutral.divider,
    contentColor: theme.semantics.content.default,
  };
}
