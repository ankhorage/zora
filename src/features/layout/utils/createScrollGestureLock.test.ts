import { expect, test } from 'bun:test';

import type { ScrollGestureLock } from '../../../types/layout';
import { createScrollGestureLock } from './createScrollGestureLock';

const inertParent: ScrollGestureLock = { acquire: () => () => undefined };

test('reports one active gesture per acquisition and releases each exactly once', () => {
  const deltas: number[] = [];
  const lock = createScrollGestureLock(inertParent, (delta) => deltas.push(delta));

  const releaseFirst = lock.acquire();
  const releaseSecond = lock.acquire();
  releaseFirst();
  releaseFirst();
  releaseSecond();

  expect(deltas).toEqual([1, 1, -1, -1]);
});

test('suspends nested ancestor containers for the lifetime of the gesture', () => {
  const outerDeltas: number[] = [];
  const innerDeltas: number[] = [];
  const outer = createScrollGestureLock(inertParent, (delta) => outerDeltas.push(delta));
  const inner = createScrollGestureLock(outer, (delta) => innerDeltas.push(delta));

  const release = inner.acquire();
  expect(outerDeltas).toEqual([1]);
  expect(innerDeltas).toEqual([1]);
  release();

  expect(outerDeltas).toEqual([1, -1]);
  expect(innerDeltas).toEqual([1, -1]);
});
