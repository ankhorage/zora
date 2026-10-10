import { describe, expect, test } from 'bun:test';

import { resolveMatrixGridContentSize } from './resolveMatrixGridContentSize';

describe('resolveMatrixGridContentSize', () => {
  test('sums variable matrix axes without materializing logical cells', () => {
    expect(
      resolveMatrixGridContentSize({
        columns: [
          { id: 'beat', size: 40 },
          { id: 'bar', size: 60 },
        ],
        rows: [
          { id: 'bass', size: 24 },
          { id: 'lead', size: 36 },
        ],
      }),
    ).toEqual({ height: 60, width: 100 });
  });

  test('rejects non-finite cumulative axis geometry through the published grid-view contract', () => {
    expect(() =>
      resolveMatrixGridContentSize({
        columns: [
          { id: 'left', size: Number.MAX_VALUE },
          { id: 'right', size: Number.MAX_VALUE },
        ],
        rows: [{ id: 'row', size: 1 }],
      }),
    ).toThrow('Layout axis cumulative world coordinates must be finite.');
  });
});
