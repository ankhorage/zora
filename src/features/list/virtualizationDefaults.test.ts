import { expect, test } from 'bun:test';

import { LIST_VIRTUALIZATION_DEFAULTS } from './constants/virtualization';
import { flatListMeta } from './flatListMeta';
import { sectionListMeta } from './sectionListMeta';

test('publishes aligned list virtualization and pagination defaults in authoring metadata', () => {
  expect(LIST_VIRTUALIZATION_DEFAULTS).toEqual({
    maxToRenderPerBatch: 10,
    onEndReachedThreshold: 2,
  });
  expect(flatListMeta.blueprint.defaultProps).toEqual(LIST_VIRTUALIZATION_DEFAULTS);
  expect(sectionListMeta.blueprint.defaultProps).toEqual({
    ...LIST_VIRTUALIZATION_DEFAULTS,
    sections: [],
  });
  for (const metadata of [flatListMeta, sectionListMeta]) {
    expect(metadata.events.endReached.payloadFields).toEqual([
      { path: 'distanceFromEnd', type: 'number' },
    ]);
    expect(metadata.props.maxToRenderPerBatch.type).toBe('number');
    expect(metadata.props.onEndReachedThreshold.type).toBe('number');
  }
});
