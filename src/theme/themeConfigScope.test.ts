import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const themeDir = import.meta.dir;

describe('canonical ThemeConfig scope propagation', () => {
  test('provider accepts the canonical ThemeConfig without duplicating live config state', () => {
    const provider = readFileSync(join(themeDir, 'ZoraProvider.tsx'), 'utf8');
    const context = readFileSync(join(themeDir, 'ZoraThemeRuntimeContext.tsx'), 'utf8');
    expect(provider).toContain('themeConfig?: ThemeConfig');
    expect(provider).toContain('themeConfig ?? createZoraThemeConfig(theme)');
    expect(context).not.toContain('ThemeConfig');
    expect(context).not.toContain('sourceTheme');
  });

  test('nested scopes derive from the current Surface config authority', () => {
    const scope = readFileSync(join(themeDir, 'ZoraThemeScope.tsx'), 'utf8');
    expect(scope).toContain('const sourceConfig = parentSurface.theme.config;');
    expect(scope).toContain('createTheme(sourceConfig');
    expect(scope).not.toContain('createZoraThemeConfig');
    expect(scope).not.toContain('sourceTheme');
  });
});
