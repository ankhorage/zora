import { describe, expect, test } from 'bun:test';

import { resolvePageMaxWidth } from './resolvePageMaxWidth';

describe('resolvePageMaxWidth', () => {
  test('keeps page width presets ordered', () => {
    expect(resolvePageMaxWidth('wide')).toBeGreaterThan(resolvePageMaxWidth('default'));
    expect(resolvePageMaxWidth('default')).toBeGreaterThan(resolvePageMaxWidth('narrow'));
  });
});
