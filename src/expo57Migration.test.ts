import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const ROOT = process.cwd();
const EXPO_EXAMPLE_DIRS = [
  'examples/expo-showcase',
  'examples/food_drink/restaurant',
  'examples/shopping_commerce/marketplace',
  'examples/shopping_commerce/storefront',
  'examples/social_community/community-feed',
  'examples/social_community/photo-social',
  'examples/social_community/private-messaging',
  'examples/social_community/visual-discovery',
] as const;
const RNVI_PLUGINS = [
  '@react-native-vector-icons/fontawesome',
  '@react-native-vector-icons/fontawesome5',
  '@react-native-vector-icons/fontawesome6',
  '@react-native-vector-icons/ionicons',
] as const;

function readJson(path: string): Record<string, unknown> {
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Expected an object in ${path}.`);
  }
  return value as Record<string, unknown>;
}

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = Reflect.get(record, key);
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Expected ${key} to be an object.`);
  }
  return value as Record<string, unknown>;
}

function readValue(record: Record<string, unknown>, key: string): unknown {
  return Reflect.get(record, key);
}

function readExamplePackage(directory: string): Record<string, unknown> {
  return readJson(join(ROOT, directory, 'package.json'));
}

describe('portable ZORA package boundary', () => {
  test('targets the released RN 0.86 and Surface 3 contract without Expo runtime peers', () => {
    const packageJson = readJson(join(ROOT, 'package.json'));
    const dependencies = readRecord(packageJson, 'dependencies');
    const peers = readRecord(packageJson, 'peerDependencies');
    const development = readRecord(packageJson, 'devDependencies');

    expect(readValue(dependencies, '@ankhorage/surface')).toBe('^3.0.2');
    expect(readValue(dependencies, '@ankhorage/contracts')).toBe('^8.0.0');
    expect(peers.react).toBe('19.2.3');
    expect(readValue(peers, 'react-native')).toBe('0.86.x');
    expect(readValue(peers, 'react-native-web')).toBe('~0.21.0');
    expect(development.typescript).toBe('~6.0.3');

    for (const expoPackage of ['@expo/vector-icons', 'expo-font', 'expo-linear-gradient']) {
      expect(readValue(peers, expoPackage)).toBeUndefined();
      expect(readValue(development, expoPackage)).toBeUndefined();
    }
  });

  test('contains no Expo runtime import or removed RN 0.85 style API', () => {
    const runtimeSource = readFileSync(
      join(ROOT, 'src', 'components', 'gradient', 'Gradient.tsx'),
      'utf8',
    );
    const shellSource = readFileSync(
      join(ROOT, 'src', 'layout', 'app-shell', 'AppShell.tsx'),
      'utf8',
    );

    expect(runtimeSource).not.toContain("from 'expo");
    expect(shellSource).not.toContain('absoluteFillObject');
    expect(shellSource).not.toMatch(/pointerEvents=/);
  });
});

describe('Expo 57 example boundary', () => {
  test('uses the canonical React, RN, RNW, TypeScript, and Expo baselines', () => {
    for (const directory of EXPO_EXAMPLE_DIRS) {
      const packageJson = readExamplePackage(directory);
      const dependencies = readRecord(packageJson, 'dependencies');
      const development = readRecord(packageJson, 'devDependencies');

      expect(readValue(dependencies, '@ankhorage/zora')).toBe('^3.0.0');
      expect(dependencies.expo).toBe('57.0.18');
      expect(dependencies.react).toBe('19.2.3');
      expect(readValue(dependencies, 'react-native')).toBe('0.86.3');
      expect(readValue(dependencies, 'react-native-web')).toBe('~0.21.0');
      expect(development.typescript).toBe('~6.0.3');
      expect(readValue(dependencies, '@expo/vector-icons')).toBeUndefined();
    }
  });

  test('registers all scoped RNVI packages in each Expo app config', () => {
    for (const directory of EXPO_EXAMPLE_DIRS) {
      const appJson = readJson(join(ROOT, directory, 'app.json'));
      const expo = readRecord(appJson, 'expo');
      const { plugins } = expo;
      expect(Array.isArray(plugins)).toBe(true);

      for (const plugin of RNVI_PLUGINS) {
        expect(plugins).toContain(plugin);
      }
    }
  });

  test('loads every icon font face exercised by Web acceptance', () => {
    const webFontSource = readFileSync(
      join(ROOT, 'examples', 'expo-showcase', 'useZoraIconFonts.web.ts'),
      'utf8',
    );

    expect(webFontSource).toContain('Ionicons.ttf');
    expect(webFontSource).toContain('FontAwesome.ttf');
    expect(webFontSource).toContain('FontAwesome5_Brands.ttf');
    expect(webFontSource).toContain('FontAwesome5_Solid.ttf');
    expect(webFontSource).toContain('FontAwesome6_Brands.ttf');
  });
});
