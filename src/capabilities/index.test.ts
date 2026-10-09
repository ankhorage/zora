import { readFileSync } from 'node:fs';

import { isCapability } from '@ankhorage/contracts/capabilities';
import { isRecord } from '@ankhorage/utility/object';
import { expect, test } from 'bun:test';

import { CAPABILITIES } from './index';

const packageJson: unknown = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const packageCapabilities =
  isRecord(packageJson) && isRecord(packageJson.ankh) ? packageJson.ankh.capabilities : undefined;

test('publishes valid, uniquely identified canonical ZORA capabilities', () => {
  expect(CAPABILITIES).toHaveLength(2);
  expect(CAPABILITIES.every(isCapability)).toBe(true);
  expect(new Set(CAPABILITIES.map((capability) => capability.id)).size).toBe(CAPABILITIES.length);
});

test('keeps Ankh package metadata identical to the canonical catalog', () => {
  expect(Array.isArray(packageCapabilities)).toBe(true);
  if (!Array.isArray(packageCapabilities)) {
    throw new Error('Expected package capability descriptors.');
  }
  expect(packageCapabilities.every(isCapability)).toBe(true);
  expect(packageCapabilities).toEqual(CAPABILITIES);
});

test('exports the catalog from the public capabilities subpath', async () => {
  const capabilities: unknown = await import('@ankhorage/zora/capabilities');
  if (!isRecord(capabilities)) {
    throw new Error('Expected a capability module record.');
  }

  expect(capabilities.CAPABILITIES).toEqual(CAPABILITIES);
});

test('preserves the executable action semantics of ZORA provider capabilities', () => {
  expect(CAPABILITIES).toEqual([
    expect.objectContaining({
      id: 'zora.create',
      owner: '@ankhorage/zora',
      access: ['invoke'],
      binding: { kind: 'action', bindableAs: ['target'] },
    }),
    expect.objectContaining({
      id: 'zora.sync',
      owner: '@ankhorage/zora',
      access: ['invoke'],
      binding: { kind: 'action', bindableAs: ['target'] },
    }),
  ]);
});
