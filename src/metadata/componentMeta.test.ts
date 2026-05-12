import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from './componentMeta';

const ROOT = process.cwd();
const SRC_ROOT = join(ROOT, 'src');

const INDEX_PATH = join(SRC_ROOT, 'index.ts');
const THEME_INDEX_PATH = join(SRC_ROOT, 'theme', 'index.ts');

function parseReexportBlocks(source: string): { names: string[]; from: string; isType: boolean }[] {
  const pattern = /\bexport\s+(type\s+)?\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g;
  const blocks: { names: string[]; from: string; isType: boolean }[] = [];

  for (const match of source.matchAll(pattern)) {
    const isType = match[1] !== undefined;
    const rawNames = match[2] ?? '';
    const from = match[3] ?? '';

    const names = rawNames
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) =>
        item
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          ?.trim(),
      )
      .filter((item): item is string => Boolean(item));

    blocks.push({ names, from, isType });
  }

  return blocks;
}

function readSource(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

function isComponentExportName(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function isJsonSerializable(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    return true;
  if (Array.isArray(value)) return value.every((item) => isJsonSerializable(item));
  if (typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  return Object.values(record).every((item) => isJsonSerializable(item));
}

describe('ZORA_COMPONENT_META public API', () => {
  test('src/index.ts re-exports ZORA_COMPONENT_META', () => {
    const indexSource = readSource(INDEX_PATH);
    expect(indexSource).toContain('ZORA_COMPONENT_META');
  });
});

describe('ZORA_COMPONENT_META registry coverage', () => {
  test('covers every public UI React component export (foundation/components/patterns/layout)', () => {
    // Avoid importing the full src/index.ts barrel here; Bun has been observed to crash when executing
    // module graphs that touch react-native. We do drift checks via static source parsing instead.
    const indexSource = readSource(INDEX_PATH);
    const blocks = parseReexportBlocks(indexSource).filter((block) => !block.isType);

    const uiComponentNames = new Set(
      blocks
        .filter((block) => {
          return (
            block.from.startsWith('./foundation') ||
            block.from.startsWith('./components') ||
            block.from.startsWith('./patterns') ||
            block.from.startsWith('./layout')
          );
        })
        .flatMap((block) => block.names)
        .filter(isComponentExportName),
    );

    const registryKeys = new Set(Object.keys(ZORA_COMPONENT_META));
    expect([...uiComponentNames].sort()).toEqual([...registryKeys].sort());
  });

  test('does not treat providers/scopes as UI component registry entries', () => {
    const indexSource = readSource(INDEX_PATH);
    expect(indexSource).toContain("export * from './theme';");

    const themeSource = readSource(THEME_INDEX_PATH);
    const themeBlocks = parseReexportBlocks(themeSource).filter((block) => !block.isType);
    const themeValueExports = new Set(
      themeBlocks.flatMap((block) => block.names).filter(isComponentExportName),
    );

    const providerExports = new Set(['ZoraProvider', 'ZoraThemeScope']);

    for (const providerExport of providerExports) {
      expect(themeValueExports.has(providerExport)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(ZORA_COMPONENT_META, providerExport)).toBe(false);
    }
  });
});

describe('ZORA_COMPONENT_META invariants', () => {
  test('every key matches meta.name', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      expect(meta.name).toBe(key);
    }
  });

  test('allowedChildren always points to a known direct manifest node', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      for (const child of meta.allowedChildren) {
        const childMeta = ZORA_COMPONENT_META[child];
        expect(childMeta, `${key} allowedChildren includes unknown key '${child}'`).toBeDefined();
        expect(
          childMeta.directManifestNode,
          `${key} allowedChildren includes non-directManifestNode key '${child}'`,
        ).toBe(true);
      }
    }
  });

  test('direct manifest node leaf/container rules', () => {
    const expectedLeafNodes = new Set([
      'PageHeader',
      'SectionHeader',
      'SettingsRow',
      'EmptyState',
      'Hero',
      'Button',
      'Input',
      'Textarea',
      'Text',
      'Heading',
      'Divider',
      'ChatListItem',
    ]);

    const expectedContainerNodes = new Set([
      'FormField',
      'Page',
      'PageSection',
      'AuthLayout',
      'Card',
      'Panel',
      'Notice',
      'PostCard',
      'Box',
      'Stack',
      'Grid',
      'Container',
    ]);

    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (!meta.directManifestNode) continue;

      if (expectedLeafNodes.has(key)) {
        expect(meta.allowedChildren.length, `${key} should be a leaf manifest node`).toBe(0);
        continue;
      }

      if (expectedContainerNodes.has(key)) {
        expect(
          meta.allowedChildren.length,
          `${key} should be a container manifest node`,
        ).toBeGreaterThan(0);
        continue;
      }

      throw new Error(
        `Direct manifest node '${key}' must be categorized as leaf or container in the test.`,
      );
    }
  });

  test('non-direct manifest nodes include an explicit note', () => {
    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (meta.directManifestNode) continue;

      expect(
        typeof meta.note === 'string' && meta.note.trim().length > 0,
        `${key} must include a note when directManifestNode is false`,
      ).toBe(true);
    }
  });

  test('registry and blueprints are JSON serializable', () => {
    expect(() => JSON.stringify(ZORA_COMPONENT_META)).not.toThrow();

    for (const [key, meta] of Object.entries(ZORA_COMPONENT_META)) {
      if (!meta.blueprint?.defaultProps) continue;

      expect(
        isJsonSerializable(meta.blueprint.defaultProps),
        `${key} blueprint.defaultProps contains a non-serializable value`,
      ).toBe(true);
    }
  });
});
