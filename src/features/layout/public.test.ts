import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const srcDir = join(import.meta.dir, '../..');
const publicSource = readFileSync(join(import.meta.dir, 'public.ts'), 'utf8');
const rootSource = readFileSync(join(srcDir, 'index.ts'), 'utf8');

const removedPublicNames = [
  'Box',
  'Center',
  'Container',
  'Inline',
  'SettingsLayout',
  'SettingsRow',
  'SidebarLayout',
  'Spacer',
  'Stack',
  'TileGrid',
  'TopbarLayout',
] as const;

describe('canonical layout boundary', () => {
  test('exports only the current layout primitives and semantic screen composition', () => {
    for (const name of ['AppShell', 'Divider', 'Grid', 'Screen', 'ScrollView', 'View']) {
      expect(publicSource).toMatch(new RegExp(`\\b${name}\\b`, 'u'));
    }

    for (const name of removedPublicNames) {
      expect(publicSource).not.toMatch(new RegExp(`\\b${name}\\b`, 'u'));
      expect(rootSource).not.toMatch(new RegExp(`export[^\\n]*\\b${name}\\b`, 'u'));
    }
  });

  test('does not retain the legacy layout or foundation ownership roots', () => {
    expect(existsSync(join(srcDir, 'layout'))).toBe(false);
    expect(existsSync(join(srcDir, 'foundation'))).toBe(false);
    expect(existsSync(join(srcDir, 'patterns'))).toBe(false);
  });

  test('keeps moved capabilities with their singular feature owners', () => {
    expect(existsSync(join(srcDir, 'features', 'content-rail', 'public.ts'))).toBe(true);
    expect(existsSync(join(srcDir, 'features', 'palette-item', 'public.ts'))).toBe(true);
    expect(existsSync(join(srcDir, 'features', 'section', 'public.ts'))).toBe(true);
  });
});
