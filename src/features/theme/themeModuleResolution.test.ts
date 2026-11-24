import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from 'bun:test';

const themeRoot = import.meta.dir;
const sourceModules = [
  'public.ts',
  'application/use-cases/compileZoraTheme.ts',
  'application/use-cases/createZoraThemeConfig.ts',
  'zoraDefaultTheme.ts',
] as const;

test('keeps theme source imports resolvable through package-owned conditional targets', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    readonly imports?: Readonly<Record<string, Readonly<Record<string, string>>>>;
  };
  const themeTargets = packageJson.imports?.['#zora/theme/*'];
  const typeTargets = packageJson.imports?.['#zora/types/*'];

  expect(themeTargets).toEqual({
    types: './dist/features/theme/*.d.ts',
    'react-native': './src/features/theme/*.ts',
    browser: './src/features/theme/*.ts',
    import: './dist/features/theme/*.js',
    default: './dist/features/theme/*.js',
  });
  expect(typeTargets).toEqual({
    types: './dist/types/*.d.ts',
    import: './dist/types/*.js',
    default: './dist/types/*.js',
  });

  for (const modulePath of sourceModules) {
    const filename = resolve(themeRoot, modulePath);
    const source = readFileSync(filename, 'utf8');
    const sourceImports = [
      ...source.matchAll(/\bfrom\s+['"](#zora\/(?:theme|types)\/[^'"]+)['"]/gu),
    ];

    expect(sourceImports.length, modulePath).toBeGreaterThan(0);
    for (const [, specifier] of sourceImports) {
      expect(specifier, modulePath).toMatch(/^#zora\/(?:theme|types)\//u);
    }
  }
});
