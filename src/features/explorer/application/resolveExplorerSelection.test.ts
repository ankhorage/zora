import { describe, expect, test } from 'bun:test';

import { resolveExplorerSelection } from './resolveExplorerSelection';

const ordered = ['a', 'b', 'c', 'd', 'e'];

describe('Explorer selection', () => {
  test('supports single selection', () => {
    expect(resolveExplorerSelection(ordered, ['a'], 'c', 'a', 'toggle', 'single')).toEqual(['c']);
  });
  test('supports toggle and deselect in multi mode', () => {
    expect(resolveExplorerSelection(ordered, ['a'], 'b', 'a', 'toggle', 'multi')).toEqual([
      'a',
      'b',
    ]);
    expect(resolveExplorerSelection(ordered, ['a', 'b'], 'a', 'a', 'toggle', 'multi')).toEqual([
      'b',
    ]);
  });
  test('supports contiguous range regardless of direction', () => {
    expect(resolveExplorerSelection(ordered, ['a'], 'd', 'b', 'range', 'multi')).toEqual([
      'b',
      'c',
      'd',
    ]);
    expect(resolveExplorerSelection(ordered, ['a'], 'b', 'd', 'range', 'multi')).toEqual([
      'b',
      'c',
      'd',
    ]);
  });
  test('ignores targets absent from catalogue', () => {
    expect(resolveExplorerSelection(ordered, ['a'], 'z', 'a', 'replace', 'multi')).toEqual(['a']);
  });
});
