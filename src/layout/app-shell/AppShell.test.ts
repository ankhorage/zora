import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const APP_SHELL_DIR = import.meta.dir;

function readAppShellFile(fileName: string): string {
  return readFileSync(join(APP_SHELL_DIR, fileName), 'utf8');
}

describe('AppShell public API', () => {
  test('does not expose raw style escape hatches', () => {
    const typesSource = readAppShellFile('types.ts');
    const implementationSource = readAppShellFile('AppShell.tsx');

    expect(typesSource).not.toContain('StyleProp');
    expect(typesSource).not.toContain('ViewStyle');
    expect(typesSource).not.toMatch(/\bstyle\??:/);
    expect(typesSource).not.toMatch(/\bbodyStyle\??:/);
    expect(implementationSource).not.toMatch(/\bbodyStyle\b/);
    expect(implementationSource).not.toMatch(/\bstyle,\s*$/m);
  });
});
