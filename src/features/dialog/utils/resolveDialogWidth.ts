import type { ZoraContentWidth } from '../../../types/layout';

export function resolveDialogWidth(width: ZoraContentWidth = 'default'): number {
  switch (width) {
    case 'narrow':
      return 420;
    case 'wide':
      return 560;
    case 'default':
    default:
      return 520;
  }
}
