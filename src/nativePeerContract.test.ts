import { readFile } from 'node:fs/promises';

import { expect, test } from 'bun:test';

const NATIVE_PEER_CONTRACTS = [
  {
    react: '19.2.3',
    'react-native': '0.86.3',
  },
  {
    react: '19.3.0',
    'react-native': '0.88.1',
  },
] as const;

const SHARED_NATIVE_PEER_VERSIONS = {
  '@react-native-vector-icons/fontawesome': '13.1.4',
  '@react-native-vector-icons/fontawesome5': '13.1.4',
  '@react-native-vector-icons/fontawesome6': '13.1.4',
  '@react-native-vector-icons/ionicons': '13.1.4',
  '@react-native-vector-icons/material-design-icons': '13.1.4',
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

test('declares jointly satisfiable Expo 57 and Expo 58 native peer contracts with Surface', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as unknown;
  if (!isRecord(packageJson)) throw new Error('Expected package.json to contain an object.');

  const { dependencies, peerDependencies } = packageJson;
  if (!isRecord(dependencies) || !isRecord(peerDependencies)) {
    throw new Error('Expected package.json dependency sections to contain objects.');
  }

  const surfaceRange = dependencies['@ankhorage/surface'];
  expect(typeof surfaceRange).toBe('string');

  const surfacePackageJson = JSON.parse(
    await readFile(
      new URL('../node_modules/@ankhorage/surface/package.json', import.meta.url),
      'utf8',
    ),
  ) as unknown;
  if (
    !isRecord(surfacePackageJson) ||
    !isRecord(surfacePackageJson.peerDependencies) ||
    typeof surfacePackageJson.version !== 'string'
  ) {
    throw new Error('Expected Surface to expose peer dependencies.');
  }

  expect(Bun.semver.satisfies(surfacePackageJson.version, surfaceRange as string)).toBe(true);

  const zoraPeers = new Map(Object.entries(peerDependencies));
  const surfacePeers = new Map(Object.entries(surfacePackageJson.peerDependencies));

  for (const contract of NATIVE_PEER_CONTRACTS) {
    for (const [name, version] of Object.entries({ ...SHARED_NATIVE_PEER_VERSIONS, ...contract })) {
      const zoraRange = zoraPeers.get(name);
      const surfaceRange = surfacePeers.get(name);

      expect(typeof zoraRange).toBe('string');
      expect(typeof surfaceRange).toBe('string');
      expect(Bun.semver.satisfies(version, zoraRange as string)).toBe(true);
      expect(Bun.semver.satisfies(version, surfaceRange as string)).toBe(true);
    }
  }
});
