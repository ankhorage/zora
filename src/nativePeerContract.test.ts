import { readFile } from 'node:fs/promises';

import { expect, test } from 'bun:test';

const EXPO_57_NATIVE_PEER_VERSIONS = {
  '@react-native-vector-icons/fontawesome': '13.1.4',
  '@react-native-vector-icons/fontawesome5': '13.1.4',
  '@react-native-vector-icons/fontawesome6': '13.1.4',
  '@react-native-vector-icons/ionicons': '13.1.4',
  '@react-native-vector-icons/material-design-icons': '13.1.4',
  react: '19.2.3',
  'react-native': '0.86.3',
  'react-native-gesture-handler': '2.32.0',
  'react-native-reanimated': '4.5.1',
  'react-native-safe-area-context': '5.7.0',
  'react-native-svg': '15.15.4',
  'react-native-web': '0.21.3',
  'react-native-worklets': '0.10.1',
} as const;

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

test('declares a jointly satisfiable Expo 57 native peer contract with Surface', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as unknown;
  if (!isRecord(packageJson)) throw new Error('Expected package.json to contain an object.');

  const { dependencies, peerDependencies } = packageJson;
  if (!isRecord(dependencies) || !isRecord(peerDependencies)) {
    throw new Error('Expected package.json dependency sections to contain objects.');
  }

  expect(dependencies['@ankhorage/surface']).toBe('^9.4.5');

  const surfacePackageJson = JSON.parse(
    await readFile(
      new URL('../node_modules/@ankhorage/surface/package.json', import.meta.url),
      'utf8',
    ),
  ) as unknown;
  if (!isRecord(surfacePackageJson) || !isRecord(surfacePackageJson.peerDependencies)) {
    throw new Error('Expected Surface to expose peer dependencies.');
  }

  const zoraPeers = new Map(Object.entries(peerDependencies));
  const surfacePeers = new Map(Object.entries(surfacePackageJson.peerDependencies));

  for (const [name, version] of Object.entries(EXPO_57_NATIVE_PEER_VERSIONS)) {
    const zoraRange = zoraPeers.get(name);
    const surfaceRange = surfacePeers.get(name);

    expect(typeof zoraRange).toBe('string');
    expect(typeof surfaceRange).toBe('string');
    expect(Bun.semver.satisfies(version, zoraRange as string)).toBe(true);
    expect(Bun.semver.satisfies(version, surfaceRange as string)).toBe(true);
  }
});
