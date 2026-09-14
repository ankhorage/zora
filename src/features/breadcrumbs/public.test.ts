import { expect, test } from 'bun:test';

import { breadcrumbsMeta } from './breadcrumbsMeta';

test('Breadcrumbs is a direct manifest node with serializable item press payload', () => {
  expect(breadcrumbsMeta.directManifestNode).toBe(true);
  expect(breadcrumbsMeta.events.itemPress.eventType).toBe('breadcrumbs.itemPress');
  expect(breadcrumbsMeta.events.itemPress.payloadFields).toEqual([
    { path: 'id', type: 'string', label: 'Item id' },
  ]);
});

test('Breadcrumbs keeps current-location derivation and callbacks outside item data', async () => {
  const [source, types] = await Promise.all([
    Bun.file('src/features/breadcrumbs/adapters/inbound/Breadcrumbs.tsx').text(),
    Bun.file('src/types/breadcrumbs.ts').text(),
  ]);

  expect(source).toContain('const currentItemId = items.at(-1)?.id;');
  expect(source).toContain('onItemPress({ id: item.id })');
  expect(types).not.toContain('onPress?:');
});
