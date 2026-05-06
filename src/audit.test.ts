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

describe('Plan 5 audit — product-facing src imports ZORA foundation, not Surface directly', () => {
  /**
   * Components, layouts, and patterns that compose ZORA primitives should import
   * foundation primitives from the local ZORA foundation layer, not directly
   * from @ankhorage/surface.
   *
   * Foundation wrappers, theme infrastructure, internal recipes, and explicit
   * Surface-wrapping boundary components are exempt.
   */
  const EXEMPT_PATHS = new Set([
    // Foundation wrappers — they ARE the Surface abstraction layer.
    join(SRC_ROOT, 'foundation'),
    // Theme infrastructure legitimately integrates with Surface theme/runtime types.
    join(SRC_ROOT, 'theme'),
    // Internal recipes may consume SurfaceTheme types as the typed recipe boundary.
    join(SRC_ROOT, 'internal'),
    // Explicit Surface primitive wrappers.
    join(SRC_ROOT, 'components', 'checkbox', 'Checkbox.tsx'),
    join(SRC_ROOT, 'components', 'icon', 'Icon.tsx'),
    join(SRC_ROOT, 'components', 'icon-button', 'IconButton.tsx'),
    join(SRC_ROOT, 'components', 'modal', 'Modal.tsx'),
    join(SRC_ROOT, 'components', 'textarea', 'Textarea.tsx'),
    join(SRC_ROOT, 'components', 'text', 'Text.tsx'),
    join(SRC_ROOT, 'components', 'form', 'FormField.tsx'),
    join(SRC_ROOT, 'patterns', 'form-field', 'FormField.tsx'),
    // Type-only imports that intentionally expose Surface-compatible prop specs.
    join(SRC_ROOT, 'components', 'checkbox', 'types.ts'),
    join(SRC_ROOT, 'components', 'form', 'types.ts'),
    join(SRC_ROOT, 'components', 'icon-button', 'types.ts'),
    join(SRC_ROOT, 'components', 'tabs', 'types.ts'),
    join(SRC_ROOT, 'components', 'text', 'types.ts'),
    join(SRC_ROOT, 'components', 'textarea', 'types.ts'),
    join(SRC_ROOT, 'components', 'toolbar', 'types.ts'),
    join(SRC_ROOT, 'patterns', 'form-field', 'types.ts'),
    join(SRC_ROOT, 'patterns', 'tile-grid', 'types.ts'),
  ]);

  function isExempt(filePath: string): boolean {
    for (const exemptPath of EXEMPT_PATHS) {
      if (isPathWithin(filePath, exemptPath)) {
        return true;
      }
    }

    return false;
  }

  const PRODUCT_FACING_DIRS = [
    join(SRC_ROOT, 'components'),
    join(SRC_ROOT, 'layout'),
    join(SRC_ROOT, 'patterns'),
  ];

  const FOUNDATION_PRIMITIVES_PATTERN =
    /import \{[^}]*\b(Box|Stack|Center|Container|Grid|Inline|Spacer|Divider)\b[^}]*\} from '@ankhorage\/surface'/;

  test('component, layout, and pattern files do not import foundation primitives directly from @ankhorage/surface', () => {
    for (const dir of PRODUCT_FACING_DIRS) {
      for (const filePath of listFiles(dir)) {
        if (isExempt(filePath)) continue;

        const source = readFileSync(filePath, 'utf8');
        const match = FOUNDATION_PRIMITIVES_PATTERN.exec(source);

        expect(
          match,
          `${filePath} imports Surface foundation primitive '${match?.[1]}' directly. ` +
            `Use the ZORA foundation import ('../../foundation') instead.`,
        ).toBeNull();
      }
    }
  });
});

describe('Plan 5 audit — no hard-coded runtime colors', () => {
  const RUNTIME_COLOR_LITERAL_PATTERN = /#[0-9A-Fa-f]{3,8}|rgba?\(|hsla?\(/;
  const EXEMPT_COLOR_LITERAL_FILES = new Set([
    // This is source-theme data, not component chrome. Plan 5 explicitly allows theme seed literals.
    join(SRC_ROOT, 'theme', 'zoraDefaultTheme.ts'),
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
