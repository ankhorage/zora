import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { expect, test } from 'bun:test';
import * as ts from 'typescript';

const themeRoot = import.meta.dir;
const sourceModules = [
  'public.ts',
  'application/use-cases/compileZoraTheme.ts',
  'application/use-cases/createZoraThemeConfig.ts',
  'zoraDefaultTheme.ts',
] as const;

test('keeps theme source imports resolvable while emitting Node ESM JavaScript specifiers', () => {
  const config = JSON.parse(readFileSync(resolve(themeRoot, '../../../tsconfig.json'), 'utf8')) as {
    readonly compilerOptions: { readonly rewriteRelativeImportExtensions?: boolean };
  };
  expect(config.compilerOptions.rewriteRelativeImportExtensions).toBe(true);

  for (const modulePath of sourceModules) {
    const filename = resolve(themeRoot, modulePath);
    const source = readFileSync(filename, 'utf8');
    const relativeImports = [
      ...source.matchAll(/\bfrom\s+['"](\.{1,2}\/[^'"]+)['"]/gu),
    ];

    for (const [, specifier] of relativeImports) {
      expect(specifier?.endsWith('.ts'), `${modulePath}: ${specifier}`).toBe(true);
      expect(existsSync(resolve(dirname(filename), specifier ?? ''))).toBe(true);
    }

    const emitted = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        rewriteRelativeImportExtensions: true,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    expect(emitted).not.toMatch(/\bfrom\s+['"][^'"]+\.ts['"]/u);
  }
});
