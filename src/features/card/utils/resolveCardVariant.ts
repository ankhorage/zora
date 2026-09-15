import type { CardProps as SurfaceCardProps } from '@ankhorage/surface';

import type { ZoraCardTone } from '../../../types/card';

export function resolveCardVariant(tone: ZoraCardTone = 'default'): SurfaceCardProps['variant'] {
  switch (tone) {
    case 'outline':
      return 'outline';
    case 'subtle':
      return 'subtle';
    case 'default':
    default:
      return 'raised';
  }
}
