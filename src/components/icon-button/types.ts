import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraColor, ZoraControlSize, ZoraEmphasis } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface IconButtonProps extends ZoraBaseProps {
  icon: ButtonIconSpec;
  label: string;
  emphasis?: ZoraEmphasis;
  color?: ZoraColor;
  size?: ZoraControlSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  testID?: string;
}
