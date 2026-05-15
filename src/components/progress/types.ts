import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ProgressProps extends ZoraBaseProps {
  value: number;
  max?: number;
  color?: ZoraColor;
  size?: ZoraControlSize;
}

export function resolveProgressRole(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
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
