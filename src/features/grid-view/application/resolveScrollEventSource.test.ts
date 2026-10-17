import { expect, test } from 'bun:test';

import { resolveScrollEventSource } from './resolveScrollEventSource';

const pending = { animated: true, expiresAt: 1000, target: 100 };

test('treats every offset as user input when no programmatic scroll is pending', () => {
  expect(resolveScrollEventSource(undefined, 40, 0)).toBe('user');
});

test('keeps intermediate animation frames separate from user input until the target is reached', () => {
  expect(resolveScrollEventSource(pending, 10, 500)).toBe('in-flight');
  expect(resolveScrollEventSource(pending, 99.4, 500)).toBe('settled');
  expect(resolveScrollEventSource(pending, 100.9, 500)).toBe('settled');
});

test('returns control to the user once the programmatic scroll window has expired', () => {
  expect(resolveScrollEventSource(pending, 10, 1001)).toBe('user');
});
