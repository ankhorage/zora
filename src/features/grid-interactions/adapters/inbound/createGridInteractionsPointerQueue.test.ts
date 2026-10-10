import { expect, test } from 'bun:test';

import { createGridInteractionsPointerQueue } from './createGridInteractionsPointerQueue';
import { resolveGridInteractionPointer } from './resolveGridInteractionPointer';

test('invalidates pending native responder callbacks after cancellation', () => {
  const callbacks: ((x: number, y: number) => void)[] = [];
  const origins: unknown[] = [];
  const queue = createGridInteractionsPointerQueue();
  const surface = {
    measureInWindow: (callback: (x: number, y: number) => void) => callbacks.push(callback),
  };

  queue.enqueue(surface, (origin) => origins.push(origin));
  queue.enqueue(surface, (origin) => origins.push(origin));
  queue.cancel();
  callbacks[0]?.(10, 20);

  expect(origins).toEqual([]);
  expect(callbacks).toHaveLength(1);
});

test('invalidates an active native responder measurement across unmount and remount', () => {
  const callbacks: ((x: number, y: number) => void)[] = [];
  const origins: unknown[] = [];
  const queue = createGridInteractionsPointerQueue();
  const surface = {
    measureInWindow: (callback: (x: number, y: number) => void) => callbacks.push(callback),
  };

  queue.enqueue(surface, (origin) => origins.push(origin));
  queue.dispose();
  queue.activate();
  queue.enqueue(surface, (origin) => origins.push(origin));
  callbacks[1]?.(30, 40);
  callbacks[0]?.(10, 20);

  expect(origins).toEqual([{ x: 30, y: 40 }]);
});

test('retires a canceled measurement slot without waiting for its callback', () => {
  const callbacks: ((x: number, y: number) => void)[] = [];
  const origins: unknown[] = [];
  const queue = createGridInteractionsPointerQueue();
  const surface = {
    measureInWindow: (callback: (x: number, y: number) => void) => callbacks.push(callback),
  };

  queue.enqueue(surface, (origin) => origins.push(origin));
  queue.cancel();
  queue.enqueue(surface, (origin) => origins.push(origin));
  callbacks[1]?.(30, 40);
  queue.enqueue(surface, (origin) => origins.push(origin));
  callbacks[0]?.(10, 20);
  callbacks[2]?.(50, 60);

  expect(origins).toEqual([
    { x: 30, y: 40 },
    { x: 50, y: 60 },
  ]);
});

test('uses the latest RNW surface origin for each serialized pointer', () => {
  const origins = [
    { left: 10, top: 20 },
    { left: 15, top: 25 },
  ];
  const resolvedOrigins: unknown[] = [];
  const queue = createGridInteractionsPointerQueue();
  const surface = {
    getBoundingClientRect: () => origins.shift(),
  };

  queue.enqueue(surface, (origin) => resolvedOrigins.push(origin));
  queue.enqueue(surface, (origin) => resolvedOrigins.push(origin));

  expect(resolvedOrigins).toEqual([
    { x: 10, y: 20 },
    { x: 15, y: 25 },
  ]);
});

test('preserves native responder-local coordinates while measuring asynchronously', () => {
  const callbacks: ((x: number, y: number) => void)[] = [];
  const pointers: unknown[] = [];
  const queue = createGridInteractionsPointerQueue();
  const surface = {
    measureInWindow: (callback: (x: number, y: number) => void) => callbacks.push(callback),
  };
  const event = { nativeEvent: { locationX: 7, locationY: 9 } };

  queue.enqueue(surface, (origin) => {
    pointers.push(resolveGridInteractionPointer(event, origin));
  });
  callbacks[0]?.(10, 20);

  expect(pointers).toEqual([{ x: 7, y: 9 }]);
});
