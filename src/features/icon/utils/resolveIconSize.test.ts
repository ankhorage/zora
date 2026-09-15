import { describe, expect, test } from 'bun:test';

import { resolveIconSize } from './resolveIconSize';

describe('resolveIconSize', () => {
  test('keeps icon sizes aligned with control sizes', () => {
    expect(resolveIconSize('s')).toBe(16);
    expect(resolveIconSize('m')).toBe(18);
    expect(resolveIconSize('l')).toBe(20);
  });
});
