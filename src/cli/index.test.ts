import { expect, test } from 'bun:test';

import { CAPABILITIES } from '../capabilities';
import provider from './index';

test('publishes ZORA create and sync through the Ankh provider', () => {
  expect(provider.id).toBe('@ankhorage/zora');
  expect(provider.category).toBe('zora');
  expect(provider.capabilities).toBe(CAPABILITIES);
  expect(provider.commands).toEqual([
    {
      path: ['create'],
      capability: CAPABILITIES[0].id,
      summary: 'Materialize a canonical ZORA component for a target platform.',
    },
    {
      path: ['sync'],
      capability: CAPABILITIES[1].id,
      summary: 'Regenerate the declared ZORA web materialization.',
    },
  ]);
  expect(provider.handlers).toHaveLength(2);
  expect(provider.handlers[0]?.path).toEqual(['create']);
  expect(provider.handlers[1]?.path).toEqual(['sync']);
});
