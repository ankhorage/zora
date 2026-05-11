import { describe, expect, test } from 'bun:test';

import { areIdsEqual, clearIds, normalizeIds, selectId, toggleId } from './resolveSelectionNextIds';
import type { SelectionMode } from './types';

describe('resolveSelectionNextIds', () => {
  test('normalizeIds removes duplicates, preserves order', () => {
    expect(normalizeIds(['a', 'b', 'a', 'c'], 'multi')).toEqual(['a', 'b', 'c']);
  });

  test('normalizeIds keeps only first id in single mode', () => {
    expect(normalizeIds(['a', 'b', 'c'], 'single')).toEqual(['a']);
  });

  test('normalizeIds treats undefined as empty', () => {
    expect(normalizeIds(undefined, 'multi')).toEqual([]);
  });

  test('areIdsEqual compares order', () => {
    expect(areIdsEqual(['a'], ['a'])).toBeTrue();
    expect(areIdsEqual(['a'], ['b'])).toBeFalse();
    expect(areIdsEqual(['a', 'b'], ['a', 'b'])).toBeTrue();
    expect(areIdsEqual(['a', 'b'], ['b', 'a'])).toBeFalse();
  });

  test('clearIds returns empty selection', () => {
    expect(clearIds()).toEqual([]);
  });

  test('selectId replaces selection in single mode', () => {
    expect(selectId({ mode: 'single', ids: ['a'], id: 'b' })).toEqual(['b']);
  });

  test('selectId adds id in multi mode when missing', () => {
    expect(selectId({ mode: 'multi', ids: ['a'], id: 'b' })).toEqual(['a', 'b']);
  });

  test('selectId is no-op in multi mode when already selected', () => {
    const ids = ['a', 'b'];
    expect(selectId({ mode: 'multi', ids, id: 'b' })).toBe(ids);
  });

  test('toggleId clears id when already selected (single mode)', () => {
    expect(toggleId({ mode: 'single', ids: ['a'], id: 'a' })).toEqual([]);
  });

  test('toggleId selects id when not selected (single mode)', () => {
    expect(toggleId({ mode: 'single', ids: [], id: 'a' })).toEqual(['a']);
  });

  test('toggleId toggles membership (multi mode)', () => {
    expect(toggleId({ mode: 'multi', ids: ['a'], id: 'b' })).toEqual(['a', 'b']);
    expect(toggleId({ mode: 'multi', ids: ['a', 'b'], id: 'b' })).toEqual(['a']);
  });

  test('mode-change normalization example', () => {
    const internalIds = ['a', 'b'];
    const mode: SelectionMode = 'single';
    expect(normalizeIds(internalIds, mode)).toEqual(['a']);
  });
});
