import type { ButtonIconSpec } from '@ankhorage/surface';

import type { ZoraControlSize, ZoraEmphasis, ZoraTone } from '../../internal/recipes';

export interface IconButtonProps {
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
