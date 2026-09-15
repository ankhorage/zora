import type { ZoraControlSize } from '../../../types/control';

export function resolveIconSize(size: ZoraControlSize = 'l'): number {
  switch (size) {
    case 's':
      return 16;
    case 'm':
      return 18;
    case 'l':
    default:
      return 20;
  }
}
