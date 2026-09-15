import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const themeDir = import.meta.dir;
const srcDir = join(themeDir, '..', '..');

describe('canonical ThemeConfig scope propagation', () => {
  test('provider accepts the canonical ThemeConfig without duplicating live config state', () => {
    const provider = readFileSync(
      join(themeDir, 'adapters', 'inbound', 'ZoraProvider.tsx'),
      'utf8',
    );
    const providerTypes = readFileSync(join(srcDir, 'types', 'provider.ts'), 'utf8');
    const context = readFileSync(
      join(themeDir, 'composition', 'ZoraThemeRuntimeContext.tsx'),
      'utf8',
    );

    expect(providerTypes).toContain('themeConfig?: ThemeConfig');
    expect(provider).toContain('themeConfig ?? createZoraThemeConfig(theme)');
    expect(context).not.toContain('ThemeConfig');
    expect(context).not.toContain('sourceTheme');
  });

  test('nested scopes delegate Surface config and mode ownership to ThemeScope', () => {
    const scope = readFileSync(join(themeDir, 'adapters', 'inbound', 'ZoraThemeScope.tsx'), 'utf8');
    expect(scope).toContain("import { ThemeScope } from '@ankhorage/surface';");
    expect(scope).toContain('<ThemeScope mode={mode}>');
    expect(scope).not.toContain('parentSurface');
    expect(scope).not.toContain('sourceConfig');
    expect(scope).not.toContain('createTheme');
    expect(scope).not.toContain('createZoraThemeConfig');
    expect(scope).not.toContain('sourceTheme');
  });
});
