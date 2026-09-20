import { describe, expect, it } from 'bun:test';

import { getGraphTopologyKey } from './getGraphTopologyKey';

describe('getGraphTopologyKey', () => {
  it('ignores presentation and input ordering', () => {
    const before = getGraphTopologyKey([{ id: 'a' }, { id: 'b' }], [{ source: 'a', target: 'b' }]);
    const after = getGraphTopologyKey(
      [
        { id: 'b', classes: 'cycle' },
        { id: 'a', data: { color: 'red' } },
      ],
      [{ source: 'a', target: 'b', classes: 'cycle' }],
    );
    expect(after).toBe(before);
  });

  it('detects changed hierarchy, membership, and edge endpoints', () => {
    const before = getGraphTopologyKey([{ id: 'a' }, { id: 'b' }], [{ source: 'a', target: 'b' }]);
    expect(
      getGraphTopologyKey(
        [{ id: 'a' }, { id: 'b', parentId: 'a' }],
        [{ source: 'a', target: 'b' }],
      ),
    ).not.toBe(before);
    expect(getGraphTopologyKey([{ id: 'a' }], [])).not.toBe(before);
    expect(
      getGraphTopologyKey([{ id: 'a' }, { id: 'b' }], [{ source: 'b', target: 'a' }]),
    ).not.toBe(before);
  });
});
