import { describe, expect, test } from 'bun:test';

import { getExplorerNextFocusId } from './getExplorerNextFocusId';

describe('Explorer virtualized keyboard focus', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  test('moves by tile and by responsive row while staying within the catalogue', () => {
    expect(getExplorerNextFocusId(ids, 'b', 'ArrowRight', 3)).toBe('c');
    expect(getExplorerNextFocusId(ids, 'b', 'ArrowDown', 3)).toBe('e');
    expect(getExplorerNextFocusId(ids, 'b', 'ArrowUp', 3)).toBe('a');
    expect(getExplorerNextFocusId(ids, 'g', 'ArrowDown', 3)).toBe('g');
  });

  test('supports first and last collection navigation without creating placeholder cells', () => {
    expect(getExplorerNextFocusId(ids, 'd', 'Home', 3)).toBe('a');
    expect(getExplorerNextFocusId(ids, 'd', 'End', 3)).toBe('g');
    expect(getExplorerNextFocusId(ids, 'd', 'Enter', 3)).toBeNull();
  });
});
