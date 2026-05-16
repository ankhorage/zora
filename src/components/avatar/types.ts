import type { ButtonIconSpec } from '@ankhorage/surface';
import type { ImageSourcePropType } from 'react-native';

import type { ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends ZoraBaseProps {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  iconFallback?: ButtonIconSpec;
  label?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: ZoraColor;
}
