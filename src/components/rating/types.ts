import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface RatingProps extends ZoraBaseProps {
  value: number;
  max?: number;
  color?: ZoraColor;
  size?: ZoraControlSize;
}

export function resolveRatingRole(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
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
