import { describe, expect, test } from 'bun:test';

import { resolveMatrixGridSelection } from './resolveMatrixGridSelection';

describe('resolveMatrixGridSelection', () => {
  test('preserves the canonical single and multi selection intent rules', () => {
    expect(resolveMatrixGridSelection(['a'], 'b', 'toggle', 'single')).toEqual(['b']);
    expect(resolveMatrixGridSelection(['a'], 'b', 'toggle', 'multi')).toEqual(['a', 'b']);
  });
});
