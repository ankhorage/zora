import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const implementationSource = readFileSync(join(import.meta.dir, 'AppShell.tsx'), 'utf8');
const layoutTypesSource = readFileSync(
  join(import.meta.dir, '../../../../types/layout.ts'),
  'utf8',
);

describe('AppShell public API', () => {
  test('does not expose raw style escape hatches', () => {
    const appShellType = layoutTypesSource.slice(
      layoutTypesSource.indexOf('export interface AppShellProps'),
      layoutTypesSource.indexOf('export interface ScreenProps'),
    );
    expect(appShellType).not.toContain('StyleProp');
    expect(appShellType).not.toContain('ViewStyle');
    expect(appShellType).not.toMatch(/\bstyle\??:/);
    expect(appShellType).not.toMatch(/\bbodyStyle\??:/);
    expect(implementationSource).not.toMatch(/\bbodyStyle\b/);
  });
});
