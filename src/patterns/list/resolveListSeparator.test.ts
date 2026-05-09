import { describe, expect, it } from 'bun:test';

import { resolveListSeparator } from './resolveListSeparator';

describe('resolveListSeparator', () => {
  it('returns none for the first item', () => {
    expect(resolveListSeparator('divider', 0)).toBe('none');
    expect(resolveListSeparator('card', 0)).toBe('none');
  });

  it('returns divider for divider rows', () => {
    expect(resolveListSeparator('divider', 1)).toBe('divider');
  });

  it('returns spacer for card rows', () => {
    expect(resolveListSeparator('card', 1)).toBe('spacer');
  });
});
