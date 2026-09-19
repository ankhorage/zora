import { expect, test } from 'bun:test';

import provider from './index';

test('publishes the ZORA create command through the Ankh provider', () => {
  expect(provider.id).toBe('@ankhorage/zora');
  expect(provider.category).toBe('zora');
  expect(provider.capabilities).toEqual(['zora.create']);
  expect(provider.commands).toEqual([
    {
      path: ['create'],
      capability: 'zora.create',
      summary: 'Materialize a canonical ZORA component for a target platform.',
    },
  ]);
  expect(provider.handlers).toHaveLength(1);
  expect(provider.handlers[0]?.path).toEqual(['create']);
});
