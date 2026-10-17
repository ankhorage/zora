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
} from '../constants/scroll';
import { resolveScrollEventSource } from './resolveScrollEventSource';

const AXES: readonly GridScrollAxis[] = ['x', 'y'];
interface EchoTail {
  lastOffset: number;
  target: number;
}

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
  // Keep ownership of late frames even after a stalled animation is reconciled.
  const echoTails = new Map<GridScrollAxis, EchoTail>();
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
    const pendingScroll = pending.get(axis);
    const offset = finalOffset ?? inFlight.get(axis);
    release(axis);
    if (offset !== undefined) {
      if (
        finalOffset === undefined &&
        pendingScroll?.animated &&
        !isSameOffset(offset, pendingScroll.target)
      ) {
        echoTails.set(axis, { lastOffset: offset, target: pendingScroll.target });
      } else {
        echoTails.delete(axis);
      }
      adopt(axis, offset);
    }
  };
  const scrolled = (axis: GridScrollAxis, offset: number) => {
    const tail = echoTails.get(axis);
    if (tail) {
      if (isContinuingProgrammaticEcho(tail, offset)) {
        position = withAxis(position, axis, offset);
        if (isSameOffset(offset, tail.target)) echoTails.delete(axis);
        else tail.lastOffset = offset;
        return;
      }
      echoTails.delete(axis);
    }
    let pendingScroll = pending.get(axis);
    if (pendingScroll?.animated && now() > pendingScroll.expiresAt) {
      // A native scroll may deliver its first frame after the initial deadline.
      // Without an explicit drag/end, that is still an echo of our scrollTo.
      pendingScroll = { ...pendingScroll, expiresAt: now() + ANIMATED_SCROLL_WINDOW_MS };
      pending.set(axis, pendingScroll);
    }
    const source = resolveScrollEventSource(pendingScroll, offset, now());
    if (source === 'in-flight' && pendingScroll) {
      clearTimer(axis);
      inFlight.set(axis, offset);
      // Native animation frames can pause longer than 120ms; only reconcile at the
      // original request deadline, or earlier on an explicit drag/end/target echo.
      timers.set(
        axis,
        schedule(() => settle(axis), Math.max(0, pendingScroll.expiresAt - now())),
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
        echoTails.delete(axis);
        pending.set(axis, { animated, expiresAt, target });
        scrollTo(axis, target, animated);
      }
      position = next;
    },
    scrolled,
    dragBegan: (axis, offset) => {
      const hadTail = echoTails.delete(axis);
      if (pending.has(axis) || inFlight.has(axis)) settle(axis, offset);
      else if (hadTail) adopt(axis, offset);
    },
    scrollEnded: (axis, offset) => {
      scrolled(axis, offset);
      echoTails.delete(axis);
      if (pending.has(axis)) settle(axis, offset);
    },
    dispose: () => {
      for (const axis of AXES) release(axis);
      echoTails.clear();
    },
  };
}

/*** Suppresses delayed monotonic frames toward the old programmatic target until an actual drag/end. */
function isContinuingProgrammaticEcho({ lastOffset, target }: EchoTail, offset: number): boolean {
  const step = offset - lastOffset;
  if (Math.abs(step) <= SCROLL_POSITION_TOLERANCE) return true;
  return (
    Math.sign(step) === Math.sign(target - lastOffset) &&
    Math.abs(target - offset) <= Math.abs(target - lastOffset) + SCROLL_POSITION_TOLERANCE
  );
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
