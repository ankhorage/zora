import { afterEach, beforeEach, expect, jest, test } from 'bun:test';

import type { GridScrollAxis } from '../../../types/grid-view';
import { createGridScrollSync } from './createGridScrollSync';

type ScrollRequest = readonly [axis: GridScrollAxis, offset: number, animated: boolean];
type UserScroll = readonly [axis: GridScrollAxis, displacement: number];

let clock = 0;

beforeEach(() => {
  clock = 0;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

/*** Advances the injected clock and the fake timers together. */
function advance(milliseconds: number) {
  clock += milliseconds;
  jest.advanceTimersByTime(milliseconds);
}

/*** Creates a controller whose native requests and user scrolls are recorded. */
function createRecordedSync() {
  const requests: ScrollRequest[] = [];
  const userScrolls: UserScroll[] = [];
  const sync = createGridScrollSync({
    now: () => clock,
    onUserScroll: (axis, displacement) => userScrolls.push([axis, displacement]),
    scrollTo: (axis, offset, animated) => requests.push([axis, offset, animated]),
  });
  return { requests, sync, userScrolls };
}

test('adopts native scrolling as user input when nothing was requested', () => {
  const { sync, userScrolls } = createRecordedSync();

  sync.scrolled('y', 30);
  sync.scrolled('y', 45);

  expect(userScrolls).toEqual([
    ['y', 30],
    ['y', 15],
  ]);
});

test('requests only axes that moved beyond the native tolerance', () => {
  const { requests, sync } = createRecordedSync();

  sync.request({ x: 0.4, y: 200 }, true);

  expect(requests).toEqual([['y', 200, true]]);
  expect(sync.isCurrent({ x: 0.9, y: 200.5 })).toBe(true);
  expect(sync.isCurrent({ x: 0, y: 202 })).toBe(false);
});

test('ignores animation frames and the settled echo of a programmatic scroll', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);

  advance(16);
  sync.scrolled('y', 60);
  advance(16);
  sync.scrolled('y', 140);
  advance(16);
  sync.scrolled('y', 200.4);
  advance(500);

  expect(userScrolls).toEqual([]);
  expect(jest.getTimerCount()).toBe(0);
  sync.scrolled('y', 230);
  expect(userScrolls).toEqual([['y', 30]]);
});

test('keeps delayed animated frames from becoming user pans after a 120ms quiet period', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);

  advance(16);
  sync.scrolled('y', 40);
  advance(150);
  expect(userScrolls).toEqual([]);
  sync.scrolled('y', 100);
  advance(150);
  sync.scrolled('y', 200);
  advance(400);

  expect(userScrolls).toEqual([]);
  expect(jest.getTimerCount()).toBe(0);
  sync.scrolled('y', 230);
  expect(userScrolls).toEqual([['y', 30]]);
});

test('ignores a first native animation frame arriving after the initial request deadline', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 300, y: 0 }, true);

  advance(800);
  sync.scrolled('x', 100);
  sync.scrolled('x', 299.7);

  expect(userScrolls).toEqual([]);
  expect(jest.getTimerCount()).toBe(0);
  sync.scrolled('x', 320);
  expect(userScrolls).toEqual([['x', 20]]);
});

test('keeps the axes independent: settling vertical leaves a pending horizontal scroll alone', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 300, y: 200 }, true);

  sync.scrolled('y', 40);
  advance(150);
  expect(userScrolls).toEqual([]);
  sync.scrollEnded('y', 40);
  expect(userScrolls).toEqual([['y', -160]]);

  sync.scrolled('x', 100);
  sync.scrolled('x', 299.6);
  expect(userScrolls).toEqual([['y', -160]]);
  expect(jest.getTimerCount()).toBe(0);
});

test('keeps a vertical animation pending while the user drags horizontally', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 300, y: 200 }, true);

  sync.dragBegan('x', 120);
  sync.scrolled('y', 80);
  sync.scrolled('y', 199.7);

  expect(userScrolls).toEqual([['x', -180]]);
});

test('adopts the native offset reported when a drag interrupts an animation', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);
  sync.scrolled('y', 40);

  sync.dragBegan('y', 55);

  expect(userScrolls).toEqual([['y', -145]]);
  expect(jest.getTimerCount()).toBe(0);
  sync.scrolled('y', 70);
  expect(userScrolls).toEqual([
    ['y', -145],
    ['y', 15],
  ]);
});

test('adopts the final native offset when an unreachable animation ends short', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 500 }, true);
  sync.scrolled('y', 120);

  sync.scrollEnded('y', 180);

  expect(userScrolls).toEqual([['y', -320]]);
  expect(jest.getTimerCount()).toBe(0);
});

test('reconciles a stalled animation at its request deadline instead of the quiet interval', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);
  sync.scrolled('y', 40);
  sync.scrolled('y', 60);

  advance(120);
  expect(userScrolls).toEqual([]);
  advance(579);
  expect(userScrolls).toEqual([]);
  advance(1);

  expect(userScrolls).toEqual([['y', -140]]);
});

test('suppresses late animation echoes even after fallback reconciles a stalled axis', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);
  sync.scrolled('y', 40);

  advance(700);
  expect(userScrolls).toEqual([['y', -160]]);

  // A delayed native animation may resume after the request deadline.
  sync.scrolled('y', 100);
  sync.scrolled('y', 200);
  expect(userScrolls).toEqual([['y', -160]]);

  // A real drag explicitly takes ownership and adopts the current physical offset.
  sync.dragBegan('y', 200);
  sync.scrolled('y', 230);
  expect(userScrolls).toEqual([
    ['y', -160],
    ['y', 160],
    ['y', 30],
  ]);
});

test('a genuine reversal after a stalled animation exits residual echo suppression', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);
  sync.scrolled('y', 40);
  advance(700);

  sync.scrolled('y', 100);
  sync.scrolled('y', 20);
  expect(userScrolls).toEqual([
    ['y', -160],
    ['y', -20],
  ]);
});

test('discards stale in-flight offsets and timers when a scroll is retargeted', () => {
  const { requests, sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, true);
  sync.scrolled('y', 40);

  sync.request({ x: 0, y: 400 }, true);
  expect(jest.getTimerCount()).toBe(0);
  advance(500);
  sync.scrolled('y', 399.5);

  expect(requests).toEqual([
    ['y', 200, true],
    ['y', 400, true],
  ]);
  expect(userScrolls).toEqual([]);
});

test('returns control to the user once the programmatic scroll window expires', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 0, y: 200 }, false);

  advance(121);
  sync.scrolled('y', 90);

  expect(userScrolls).toEqual([['y', -110]]);
});

test('cancels every pending settle timer on dispose', () => {
  const { sync, userScrolls } = createRecordedSync();
  sync.request({ x: 300, y: 200 }, true);
  sync.scrolled('x', 20);
  sync.scrolled('y', 40);
  expect(jest.getTimerCount()).toBe(2);

  sync.dispose();
  advance(1000);

  expect(jest.getTimerCount()).toBe(0);
  expect(userScrolls).toEqual([]);
});
