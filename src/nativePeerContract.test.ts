import { readFile } from 'node:fs/promises';

import { expect, test } from 'bun:test';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOptionalPeer(metadata: unknown, packageName: string): boolean {
  if (!isRecord(metadata)) return false;
  const peerMetadata = metadata[packageName];
  return isRecord(peerMetadata) && peerMetadata.optional === true;
}

test('root-entry native imports are required peers', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as unknown;
  if (!isRecord(packageJson)) throw new Error('Expected package.json to contain an object.');

  const { peerDependenciesMeta } = packageJson;
  expect(isOptionalPeer(peerDependenciesMeta, 'expo-linear-gradient')).toBe(false);
  expect(isOptionalPeer(peerDependenciesMeta, '@react-native-picker/picker')).toBe(false);
});
