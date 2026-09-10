import { expect, test } from 'bun:test';

import { partitionListSections } from './partitionListSections';

test('partitions children without changing item identity or order', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const sections = partitionListSections(items, [
    { key: 'first', title: 'First', itemCount: 2 },
    { key: 'second', itemCount: 1 },
  ]);
  expect(sections[0]?.data).toEqual(items.slice(0, 2));
  expect(sections[1]?.data[0]).toBe(items[2]);
});

test('rejects duplicate identities, invalid counts, and omitted or overflowing children', () => {
  expect(() =>
    partitionListSections(
      [],
      [
        { key: 'a', itemCount: 0 },
        { key: 'a', itemCount: 0 },
      ],
    ),
  ).toThrow('unique');
  expect(() => partitionListSections([], [{ key: 'a', itemCount: -1 }])).toThrow('non-negative');
  expect(() => partitionListSections([], [{ key: 'a', itemCount: 0.5 }])).toThrow('integer');
  expect(() => partitionListSections(['a'], [])).toThrow('cover');
  expect(() => partitionListSections(['a'], [{ key: 'a', itemCount: 2 }])).toThrow('cover');
  expect(partitionListSections([], [])).toEqual([]);
});
