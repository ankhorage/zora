import { expect, test } from 'bun:test';

import provider from './index';

test('publishes ZORA create and sync through the Ankh provider', () => {
  expect(provider.id).toBe('@ankhorage/zora');
  expect(provider.category).toBe('zora');
  expect(provider.capabilities).toEqual(['zora.create', 'zora.sync']);
  expect(provider.commands).toEqual([
    {
      path: ['create'],
      capability: 'zora.create',
      summary: 'Materialize a canonical ZORA component for a target platform.',
    },
    {
      path: ['sync'],
      capability: 'zora.sync',
      summary: 'Regenerate the declared ZORA web materialization.',
    },
  ]);
  expect(provider.handlers).toHaveLength(2);
  expect(provider.handlers[0]?.path).toEqual(['create']);
  expect(provider.handlers[1]?.path).toEqual(['sync']);
});
