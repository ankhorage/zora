import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { ZoraControlSize, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface RatingProps extends ZoraBaseProps {
  value: number;
  max?: number;
  tone?: ZoraTone;
  size?: ZoraControlSize;
}

export function resolveRatingRole(theme: SurfaceTheme, tone: ZoraTone): RoleSemantics {
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
