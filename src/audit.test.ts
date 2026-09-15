/**
 * Plan 5 — Semantic theme usage audit regression guards.
 *
 * These tests verify that stale or forbidden APIs from before Plan 3/4 do not
 * re-appear in the ZORA source, examples, or public exports.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const ROOT = process.cwd();
const SRC_ROOT = join(ROOT, 'src');
const EXAMPLES_ROOT = join(ROOT, 'examples');
const README_PATH = join(ROOT, 'README.md');
const PACKAGE_JSON_PATH = join(ROOT, 'package.json');

const IGNORED_DIRECTORY_NAMES = new Set([
  '.expo',
  '.git',
  '.turbo',
  '.vercel',
  'coverage',
  'dist',
  'node_modules',
]);

function listFiles(root: string, excludeTests = false): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && IGNORED_DIRECTORY_NAMES.has(entry.name)) {
      return [];
    }

    const absolutePath = join(root, entry.name);
    if (entry.isDirectory()) {
      return listFiles(absolutePath, excludeTests);
    }

    if (!entry.isFile() || !/\.[cm]?tsx?$/.test(entry.name)) {
      return [];
    }

    if (excludeTests && /\.test\.[cm]?tsx?$/.test(entry.name)) {
      return [];
    }

    return [absolutePath];
  });
}

function readSource(root: string, excludeTests = false): string {
  return listFiles(root, excludeTests)
    .map((filePath) => readFileSync(filePath, 'utf8'))
    .join('\n');
}

function isPathWithin(filePath: string, directoryPath: string): boolean {
  return filePath === directoryPath || filePath.startsWith(`${directoryPath}/`);
}

const srcSource = readSource(SRC_ROOT, true); // exclude test files from stale-API scan
const examplesSource = readSource(EXAMPLES_ROOT);
const readmeSource = readFileSync(README_PATH, 'utf8');
const packageJsonSource = readFileSync(PACKAGE_JSON_PATH, 'utf8');

const allSource = [srcSource, examplesSource, readmeSource, packageJsonSource].join('\n');

describe('Plan 5 audit — no stale color-tone APIs', () => {
  test('no ColorTone / colorTone / ZORA_COLOR_TONES / ZoraColorTone references', () => {
    expect(allSource).not.toMatch(/ColorTone|colorTone|ZORA_COLOR_TONES|ZoraColorTone/);
  });

  test('no ZORA_COLOR_HARMONIES / ZoraColorHarmony references', () => {
    expect(allSource).not.toMatch(/ZORA_COLOR_HARMONIES|ZoraColorHarmony/);
  });

  test('no ZoraHexColor references', () => {
    expect(allSource).not.toMatch(/ZoraHexColor/);
  });

  test('no AnkhTheme references', () => {
    expect(allSource).not.toMatch(/AnkhTheme/);
  });

  test('no direct culori imports', () => {
    expect(allSource).not.toMatch(/from 'culori'|from "culori"/);
    // also check package.json does not list culori as a direct dependency
    // (it may appear in the source text via color-theory transitive deps, but
    // ZORA must not import it directly)
    const pkg = JSON.parse(packageJsonSource) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    expect(Object.keys(pkg.dependencies ?? {})).not.toContain('culori');
    expect(Object.keys(pkg.devDependencies ?? {})).not.toContain('culori');
  });

  test('no ThemeComposerRecommendation / suggestedColorTone / hueDegreesToZoraHexColor / generatedColorRoles', () => {
    expect(allSource).not.toMatch(
      /ThemeComposerRecommendation|suggestedColorTone|hueDegreesToZoraHexColor|generatedColorRoles/,
    );
  });

  test('no ColorMood / AppMood / APP_MOODS references', () => {
    expect(allSource).not.toMatch(/ColorMood|colorMood|AppMood|appMood|APP_MOODS/);
  });
});

describe('Plan 5 audit — no showcase bridge or direct Surface imports in examples', () => {
  test('examples do not use a local zora bridge (./zora, ../zora, ../../zora)', () => {
    expect(examplesSource).not.toMatch(/from ['"]\.\.?\/.*zora['"]/);
  });

  test('examples do not import from @ankhorage/surface directly', () => {
    expect(examplesSource).not.toContain("from '@ankhorage/surface'");
    expect(examplesSource).not.toContain('from "@ankhorage/surface"');
  });
});

describe('Plan 5 audit — product-facing src imports ZORA layout primitives, not Surface directly', () => {
  /**
   * Product-facing features that compose ZORA layout primitives should import them from ZORA,
   * not directly from @ankhorage/surface. The feature-owned layout adapters are the deliberate
   * Surface foundation boundary.
   */
  const SURFACE_FOUNDATION_BOUNDARY = join(SRC_ROOT, 'features', 'layout');
  const PRODUCT_FACING_DIRS = [join(SRC_ROOT, 'features')];
  const FOUNDATION_PRIMITIVES_PATTERN =
    /import \{[^}]*\b(View|ScrollView|Grid|Divider)\b[^}]*\} from '@ankhorage\/surface'/;

  test('product-facing feature files do not import foundation primitives directly from @ankhorage/surface', () => {
    for (const dir of PRODUCT_FACING_DIRS) {
      for (const filePath of listFiles(dir)) {
        if (isPathWithin(filePath, SURFACE_FOUNDATION_BOUNDARY)) continue;

        const source = readFileSync(filePath, 'utf8');
        const match = FOUNDATION_PRIMITIVES_PATTERN.exec(source);

        expect(
          match,
          `${filePath} imports Surface foundation primitive '${match?.[1]}' directly. ` +
            'Use the feature-owned ZORA layout API instead.',
        ).toBeNull();
      }
    }
  });
});

describe('Plan 5 audit — no hard-coded runtime colors', () => {
  const RUNTIME_COLOR_LITERAL_PATTERN = /#[0-9A-Fa-f]{3,8}|rgba?\(|hsla?\(/;
  const EXEMPT_COLOR_LITERAL_FILES = new Set([
    // This is source-theme data, not component chrome. Plan 5 explicitly allows theme seed literals.
    join(SRC_ROOT, 'features', 'theme', 'zoraDefaultTheme.ts'),
  ]);

  test('non-test src files do not contain raw runtime color literals', () => {
    for (const filePath of listFiles(SRC_ROOT, true)) {
      if (EXEMPT_COLOR_LITERAL_FILES.has(filePath)) continue;

      const source = readFileSync(filePath, 'utf8');
      const match = RUNTIME_COLOR_LITERAL_PATTERN.exec(source);

      expect(
        match,
        `${filePath} contains raw runtime color literal '${match?.[0]}'. ` +
          'Use a theme token, recipe, or explicit documented exemption instead.',
      ).toBeNull();
    }
  });
});

describe('Plan 5 audit — public exports carry no legacy types', () => {
  test('src/index.ts does not export ZoraHexColor', () => {
    const indexSource = readFileSync(join(SRC_ROOT, 'index.ts'), 'utf8');

    expect(indexSource).not.toContain('ZoraHexColor');
  });

  test('src/index.ts does not export ZoraColorTone or ZORA_COLOR_TONES', () => {
    const indexSource = readFileSync(join(SRC_ROOT, 'index.ts'), 'utf8');

    expect(indexSource).not.toMatch(/ZoraColorTone|ZORA_COLOR_TONES/);
  });

  test('src/index.ts does not export ZoraColorHarmony or ZORA_COLOR_HARMONIES', () => {
    const indexSource = readFileSync(join(SRC_ROOT, 'index.ts'), 'utf8');

    expect(indexSource).not.toMatch(/ZoraColorHarmony|ZORA_COLOR_HARMONIES/);
  });

  test('src/index.ts does not export AnkhTheme', () => {
    const indexSource = readFileSync(join(SRC_ROOT, 'index.ts'), 'utf8');

    expect(indexSource).not.toContain('AnkhTheme');
  });
});
