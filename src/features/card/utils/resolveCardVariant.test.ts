import { describe, expect, test } from 'bun:test';

import { resolveCardVariant } from './resolveCardVariant';

describe('resolveCardVariant', () => {
  test('maps card tones to Surface variants', () => {
    expect(resolveCardVariant()).toBe('raised');
    expect(resolveCardVariant('outline')).toBe('outline');
    expect(resolveCardVariant('subtle')).toBe('subtle');
  });
});
