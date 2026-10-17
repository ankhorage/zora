import type { GridPendingScroll } from '../../../types/grid-view';
import { SCROLL_POSITION_TOLERANCE } from '../constants/scroll';

/*** Classifies a native scroll offset as a user gesture, the settled echo of a programmatic scroll, or an in-flight frame of one. */
export function resolveScrollEventSource(
  pending: GridPendingScroll | undefined,
  offset: number,
  now: number,
): 'in-flight' | 'settled' | 'user' {
  if (pending === undefined || now > pending.expiresAt) return 'user';
  return Math.abs(offset - pending.target) <= SCROLL_POSITION_TOLERANCE ? 'settled' : 'in-flight';
}
