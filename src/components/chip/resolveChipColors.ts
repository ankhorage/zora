import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { ZoraTone } from '../../internal/recipes';
import type { ChipColors, ChipInteractionState } from './types';

function resolveChipRole(theme: SurfaceTheme, tone: ZoraTone): RoleSemantics {
  switch (tone) {
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
  tone,
  selected,
  state,
}: {
  theme: SurfaceTheme;
  tone: ZoraTone;
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

  const role = resolveChipRole(theme, tone);

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
