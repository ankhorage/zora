import type { ZoraBaseProps } from './base';
import type { ZoraControlSize } from './control';
import type { ZoraColor } from './theme';

export interface RatingProps extends ZoraBaseProps {
  value: number;
  max?: number;
  color?: ZoraColor;
  size?: ZoraControlSize;
}
