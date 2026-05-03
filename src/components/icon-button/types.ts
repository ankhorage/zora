import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraControlSize, ZoraEmphasis, ZoraTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface IconButtonProps extends ZoraBaseProps {
  icon: ButtonIconSpec;
  label: string;
  emphasis?: ZoraEmphasis;
  tone?: ZoraTone;
  size?: ZoraControlSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  testID?: string;
}
