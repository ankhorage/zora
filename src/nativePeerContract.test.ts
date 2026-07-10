import { readFile } from 'node:fs/promises';

import { expect, test } from 'bun:test';

test('root-entry native imports are required peers', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  };

  expect(packageJson.peerDependenciesMeta?.['expo-linear-gradient']?.optional).not.toBe(true);
  expect(packageJson.peerDependenciesMeta?.['@react-native-picker/picker']?.optional).not.toBe(true);
});
