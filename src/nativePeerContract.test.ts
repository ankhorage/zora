import { readFile } from 'node:fs/promises';

import { expect, test } from 'bun:test';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

test('root-entry native imports expose only required portable peers', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as unknown;
  if (!isRecord(packageJson)) throw new Error('Expected package.json to contain an object.');

  const { peerDependencies } = packageJson;
  expect(
    isRecord(peerDependencies) && peerDependencies['@react-native-picker/picker'],
  ).toBeUndefined();
  expect(isRecord(peerDependencies) && peerDependencies['expo-linear-gradient']).toBeUndefined();
  expect(isRecord(peerDependencies) && peerDependencies['expo-font']).toBeUndefined();
  expect(isRecord(peerDependencies) && peerDependencies['@expo/vector-icons']).toBeUndefined();
});
