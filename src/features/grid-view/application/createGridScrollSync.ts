import type {
  GridPendingScroll,
  GridScrollAxis,
  GridScrollPosition,
  GridScrollSync,
  GridScrollSyncOptions,
} from '../../../types/grid-view';
import {
  ANIMATED_SCROLL_WINDOW_MS,
  IMMEDIATE_SCROLL_WINDOW_MS,
  SCROLL_POSITION_TOLERANCE,
  SCROLL_SETTLE_DELAY_MS,
} from '../constants/scroll';
import { resolveScrollEventSource } from './resolveScrollEventSource';

const AXES: readonly GridScrollAxis[] = ['x', 'y'];

/***
 * Arbitrates each native scroll axis between programmatic requests and the user,
 * so echoes of GridView's own scrollTo calls never become viewport pans.
 */
export function createGridScrollSync({
  scrollTo,
  onUserScroll,
  now = Date.now,
  schedule = setTimeout,
  cancel = clearTimeout,
}: GridScrollSyncOptions): GridScrollSync {
  let position: GridScrollPosition = { x: 0, y: 0 };
  const pending = new Map<GridScrollAxis, GridPendingScroll>();
  const inFlight = new Map<GridScrollAxis, number>();
  const timers = new Map<GridScrollAxis, ReturnType<typeof setTimeout>>();

  const clearTimer = (axis: GridScrollAxis) => {
    const timer = timers.get(axis);
    if (timer !== undefined) cancel(timer);
    timers.delete(axis);
  };
  const release = (axis: GridScrollAxis) => {
    clearTimer(axis);
    pending.delete(axis);
    inFlight.delete(axis);
  };
  const adopt = (axis: GridScrollAxis, offset: number) => {
    const displacement = offset - readAxis(position, axis);
    position = withAxis(position, axis, offset);
    if (displacement !== 0) onUserScroll(axis, displacement);
  };
  const settle = (axis: GridScrollAxis, finalOffset?: number) => {
    const offset = finalOffset ?? inFlight.get(axis);
    release(axis);
    if (offset !== undefined) adopt(axis, offset);
  };
  const scrolled = (axis: GridScrollAxis, offset: number) => {
    const source = resolveScrollEventSource(pending.get(axis), offset, now());
    if (source === 'in-flight') {
      clearTimer(axis);
      inFlight.set(axis, offset);
      timers.set(
        axis,
        schedule(() => settle(axis), SCROLL_SETTLE_DELAY_MS),
      );
      return;
    }
    release(axis);
    if (source === 'user') adopt(axis, offset);
  };

  return {
    isCurrent: (next) =>
      AXES.every((axis) => isSameOffset(readAxis(position, axis), readAxis(next, axis))),
    request: (next, animated) => {
      const windowMs = animated ? ANIMATED_SCROLL_WINDOW_MS : IMMEDIATE_SCROLL_WINDOW_MS;
      const expiresAt = now() + windowMs;
      for (const axis of AXES) {
        const target = readAxis(next, axis);
        if (isSameOffset(readAxis(position, axis), target)) continue;
        release(axis);
        pending.set(axis, { expiresAt, target });
        scrollTo(axis, target, animated);
      }
      position = next;
    },
    scrolled,
    dragBegan: (axis, offset) => {
      if (pending.has(axis) || inFlight.has(axis)) settle(axis, offset);
    },
    scrollEnded: (axis, offset) => {
      scrolled(axis, offset);
      if (pending.has(axis)) settle(axis, offset);
    },
    dispose: () => {
      for (const axis of AXES) release(axis);
    },
  };
}

/*** Reads one axis of a physical scroll position. */
function readAxis(value: GridScrollPosition, axis: GridScrollAxis): number {
  return axis === 'x' ? value.x : value.y;
}

/*** Replaces one axis of a physical scroll position. */
function withAxis(
  value: GridScrollPosition,
  axis: GridScrollAxis,
  offset: number,
): GridScrollPosition {
  return axis === 'x' ? { ...value, x: offset } : { ...value, y: offset };
}

/*** Treats offsets within the native positioning tolerance as the same scroll offset. */
function isSameOffset(left: number, right: number): boolean {
  return Math.abs(left - right) <= SCROLL_POSITION_TOLERANCE;
}
