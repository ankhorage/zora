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

  test('uses full visual positions and skips disabled items without collapsing rows', () => {
    const disabled = new Set(['d', 'a']);
    expect(getExplorerNextFocusId(ids, 'b', 'ArrowDown', 3, disabled)).toBe('e');
    expect(getExplorerNextFocusId(ids, 'b', 'Home', 3, disabled)).toBe('b');
    expect(getExplorerNextFocusId(ids, 'f', 'ArrowLeft', 3, new Set(['e']))).toBe('d');
    expect(getExplorerNextFocusId(ids, 'g', 'End', 3, new Set(['g']))).toBe('f');
    expect(getExplorerNextFocusId(ids, 'b', 'Home', 3, new Set(ids))).toBeNull();
  });

  test('navigates across ten thousand virtual positions without materializing DOM cells', () => {
    const large = Array.from({ length: 10000 }, (_, index) => `tile-${index}`);
    expect(getExplorerNextFocusId(large, 'tile-0', 'End', 4)).toBe('tile-9999');
    expect(getExplorerNextFocusId(large, 'tile-9999', 'Home', 4)).toBe('tile-0');
    expect(getExplorerNextFocusId(large, 'tile-2', 'ArrowDown', 4)).toBe('tile-6');
    expect(getExplorerNextFocusId(large, 'tile-2', 'ArrowDown', 2)).toBe('tile-4');
  });

  test('supports first and last collection navigation without creating placeholder cells', () => {
    expect(getExplorerNextFocusId(ids, 'd', 'Home', 3)).toBe('a');
    expect(getExplorerNextFocusId(ids, 'd', 'End', 3)).toBe('g');
    expect(getExplorerNextFocusId(ids, 'd', 'Enter', 3)).toBeNull();
  });
});
