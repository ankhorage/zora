import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { expect, test } from 'bun:test';

const themeRoot = import.meta.dir;
const sourceModules = [
  'public.ts',
  'application/use-cases/compileZoraTheme.ts',
  'application/use-cases/createZoraThemeConfig.ts',
  'zoraDefaultTheme.ts',
] as const;

test('keeps theme source imports resolvable through JavaScript ESM specifiers', () => {
  for (const modulePath of sourceModules) {
    const filename = resolve(themeRoot, modulePath);
    const source = readFileSync(filename, 'utf8');
    const relativeImports = [...source.matchAll(/\bfrom\s+['"](\.{1,2}\/[^'"]+)['"]/gu)];

    for (const [, specifier] of relativeImports) {
      expect(specifier?.endsWith('.js'), `${modulePath}: ${specifier}`).toBe(true);
      expect(
        existsSync(resolve(dirname(filename), (specifier ?? '').replace(/\.js$/u, '.ts'))),
      ).toBe(true);
    }
  }
});
