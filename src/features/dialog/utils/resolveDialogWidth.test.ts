import { describe, expect, test } from 'bun:test';

import { resolveDialogWidth } from './resolveDialogWidth';

describe('resolveDialogWidth', () => {
  test('keeps dialog width presets ordered', () => {
    expect(resolveDialogWidth('narrow')).toBeLessThan(resolveDialogWidth('default'));
    expect(resolveDialogWidth('wide')).toBeGreaterThanOrEqual(resolveDialogWidth('default'));
  });
});
