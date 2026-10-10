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
});
