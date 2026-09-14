import type { ZoraColor, ZoraControlSize } from '../internal/recipes';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface RatingProps extends ZoraBaseProps {
  value: number;
  max?: number;
  color?: ZoraColor;
  size?: ZoraControlSize;
}
