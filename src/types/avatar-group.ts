import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ImageSourcePropType } from 'react-native';

import type { AvatarShape, AvatarSize } from '../features/avatar/public';
import type { ZoraColor } from '../internal/recipes';
import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface AvatarGroupItem {
  id?: string;
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  iconFallback?: ButtonIconSpec;
  label?: string;
  color?: ZoraColor;
}

export interface AvatarGroupProps extends ZoraBaseProps {
  items: readonly AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  overflowLabel?: (overflowCount: number) => string;
}
