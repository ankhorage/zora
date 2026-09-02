import {
  COLOR_HARMONIES,
  generateThemeModeColors,
  parseHexColorOrThrow,
} from '@ankhorage/color-theory';
import type { ThemeConfig } from '@ankhorage/contracts';
import { describe, expect, test } from 'bun:test';

import { compileZoraTheme, type ZoraComputedTheme, type ZoraThemeSelectionTarget } from './public';

const baseConfig: ThemeConfig = {
  id: 'compiler-test',
  name: 'Compiler test',
  light: { primaryColor: '#2563eb', harmony: 'analogous' },
  dark: { primaryColor: '#f97316', harmony: 'square' },
};

function selectionTarget(
  overrides: Partial<ZoraThemeSelectionTarget> = {},
): ZoraThemeSelectionTarget {
  return {
    id: 'primary-action',
    swatch: 'primary',
    target: { lightness: 0.55, chroma: 0.15 },
    contexts: [
      {
        id: 'canvas',
        against: parseHexColorOrThrow('#ffffff'),
        minimumContrast: 1,
      },
    ],
    tiePolicy: 'lower-step',
    ...overrides,
  };
}

describe('compileZoraTheme', () => {
  test('compiles different light and dark inputs through their canonical owners', () => {
    const result: ZoraComputedTheme = compileZoraTheme(baseConfig);

    expect(result.themeConfig).toBe(baseConfig);
    expect(result.light.mode).toBe('light');
    expect(result.dark.mode).toBe('dark');
    expect(result.light.generated).toEqual(generateThemeModeColors(baseConfig.light));
    expect(result.dark.generated).toEqual(generateThemeModeColors(baseConfig.dark));
    expect(result.light.surfaceTheme.config).toBe(baseConfig);
    expect(result.dark.surfaceTheme.config).toBe(baseConfig);
    expect(result.light.surfaceTheme.colorDiagnostics.generated).toEqual(result.light.generated);
    expect(result.dark.surfaceTheme.colorDiagnostics.generated).toEqual(result.dark.generated);
    expect(result.diagnostics).toEqual([]);
  });

  test('accepts every harmony from the canonical Color Theory catalog', () => {
    for (const harmony of COLOR_HARMONIES) {
      const result = compileZoraTheme({
        ...baseConfig,
        light: { ...baseConfig.light, harmony },
        dark: { ...baseConfig.dark, harmony },
      });

      expect(result.light.generated.harmonyRoleColors.harmony).toBe(harmony);
      expect(result.dark.generated.harmonyRoleColors.harmony).toBe(harmony);
    }
  });

  test('delegates measurable swatch targets to Color Theory', () => {
    const target = selectionTarget();
    const result = compileZoraTheme(baseConfig, { selectionTargets: { light: [target] } });

    expect(result.light.selections).toHaveLength(1);
    expect(result.light.selections[0]?.request).toBe(target);
    expect(result.light.selections[0]?.result?.selected).not.toBeNull();
    expect(result.light.diagnostics).toEqual([]);
  });

  test('reports a missing role instead of substituting another swatch', () => {
    const config: ThemeConfig = {
      ...baseConfig,
      light: { ...baseConfig.light, harmony: 'monochromatic' },
    };
    const target = selectionTarget({ id: 'quaternary-action', swatch: 'quaternary' });
    const result = compileZoraTheme(config, { selectionTargets: { light: [target] } });

    expect(result.light.selections[0]?.result).toBeNull();
    expect(result.light.diagnostics).toEqual([
      expect.objectContaining({
        code: 'missing-target-swatch',
        path: 'light.selectionTargets.quaternary-action',
      }),
    ]);
  });

  test('reports targets that cannot satisfy their measured contrast contexts', () => {
    const target = selectionTarget({
      contexts: [
        {
          id: 'impossible',
          against: parseHexColorOrThrow('#ffffff'),
          minimumContrast: 21,
        },
      ],
    });
    const result = compileZoraTheme(baseConfig, { selectionTargets: { light: [target] } });

    expect(result.light.selections[0]?.result?.selected).toBeNull();
    expect(result.light.diagnostics[0]?.code).toBe('unresolved-selection-target');
  });

  test('records direct, defaulted, and derived provenance without persisting computed output', () => {
    const result = compileZoraTheme(baseConfig, {
      selectionTargets: { light: [selectionTarget()] },
    });

    expect(result.provenance).toContainEqual({
      path: 'themeConfig',
      origin: 'direct',
      owner: '@ankhorage/contracts',
    });
    expect(result.provenance).toContainEqual({
      path: 'themeConfig.tokens',
      origin: 'defaulted',
      owner: '@ankhorage/surface',
    });
    expect(
      result.light.provenance.some(
        ({ origin, owner, path }) =>
          path === 'light.generated' && origin === 'derived' && owner === '@ankhorage/color-theory',
      ),
    ).toBe(true);
    expect('generated' in result.themeConfig).toBe(false);
  });

  test('rejects invalid canonical source colors', () => {
    expect(() =>
      compileZoraTheme({
        ...baseConfig,
        light: { ...baseConfig.light, primaryColor: 'blue' },
      }),
    ).toThrow();
  });

  test('imports and executes through the public theme subpath in plain Bun', async () => {
    const script = [
      "import { compileZoraTheme } from '@ankhorage/zora/theme';",
      `const result = compileZoraTheme(${JSON.stringify(baseConfig)});`,
      'process.stdout.write(`${result.light.mode}:${result.dark.mode}`);',
    ].join('\n');
    const subprocess = Bun.spawn({
      cmd: [process.execPath, '-e', script],
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(subprocess.stdout).text(),
      new Response(subprocess.stderr).text(),
      subprocess.exited,
    ]);

    expect(exitCode, stderr).toBe(0);
    expect(stdout).toBe('light:dark');
  });
});
