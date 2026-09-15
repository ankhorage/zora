import type { ZoraContentWidth } from '../../../types/layout';

export function resolvePageMaxWidth(width: ZoraContentWidth = 'default'): number {
  switch (width) {
    case 'narrow':
      return 760;
    case 'wide':
      return 1280;
    case 'default':
    default:
      return 1040;
  }
}
