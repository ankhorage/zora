import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraButtonVariant, ZoraColor, ZoraControlSize } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface IconButtonProps extends ZoraBaseProps {
  icon: ButtonIconSpec;
  label: string;
  variant?: ZoraButtonVariant;
  color?: ZoraColor;
  size?: ZoraControlSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  testID?: string;
}
