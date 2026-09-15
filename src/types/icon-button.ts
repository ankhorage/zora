import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';
import type { ZoraButtonVariant } from './button';
import type { ZoraControlSize } from './control';
import type { ZoraColor } from './theme';

export interface IconButtonProps extends ZoraBaseProps {
  icon?: ButtonIconSpec;
  iconName?: Extract<ButtonIconSpec, { provider?: 'Ionicons' }>['name'];
  label: string;
  variant?: ZoraButtonVariant;
  color?: ZoraColor;
  size?: ZoraControlSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  testID?: string;
}
