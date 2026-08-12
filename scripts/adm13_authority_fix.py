from pathlib import Path

Path('src/theme/ZoraThemeRuntimeContext.tsx').write_text(r'''import { createContext, useContext } from 'react';

import type { ZoraThemeId } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

interface ZoraThemeRuntime {
  themeId: ZoraThemeId;
}

export const ZoraThemeRuntimeContext = createContext<ZoraThemeRuntime>({
  themeId: zoraDefaultTheme.id,
});

export function useZoraThemeRuntime(): ZoraThemeRuntime {
  return useContext(ZoraThemeRuntimeContext);
}
''', encoding='utf-8')

Path('src/theme/ZoraProvider.tsx').write_text(r'''import type { ThemeConfig } from '@ankhorage/contracts';
import { ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';
import { ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraProviderProps {
  children: React.ReactNode;
  theme?: ZoraTheme;
  themeConfig?: ThemeConfig;
  initialMode?: ZoraThemeMode;
}

/** Installs the ZORA theme runtime and underlying Surface theme provider. */
export function ZoraProvider({
  children,
  theme = zoraDefaultTheme,
  themeConfig,
  initialMode = 'light',
}: ZoraProviderProps) {
  const resolvedConfig = React.useMemo(
    () => themeConfig ?? createZoraThemeConfig(theme),
    [theme, themeConfig],
  );
  const runtimeValue = React.useMemo(() => ({ themeId: resolvedConfig.id }), [resolvedConfig.id]);

  return (
    <ZoraThemeRuntimeContext.Provider value={runtimeValue}>
      <ThemeProvider initialConfig={resolvedConfig} initialMode={initialMode}>
        {children}
      </ThemeProvider>
    </ZoraThemeRuntimeContext.Provider>
  );
}
''', encoding='utf-8')

Path('src/theme/ZoraThemeScope.tsx').write_text(r'''import { createTheme, ThemeContext, useFontContext, useTheme } from '@ankhorage/surface';
import React, { useMemo } from 'react';

import { resolveZoraScopedThemeId } from './resolveZoraScopedThemeId';
import type { ZoraThemeId, ZoraThemeMode } from './types';
import { useZoraThemeRuntime, ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraThemeScopeProps {
  children: React.ReactNode;
  themeId?: ZoraThemeId;
  mode?: ZoraThemeMode;
}

function ZoraThemeScopeInner({ children, themeId, mode }: ZoraThemeScopeProps) {
  const parentSurface = useTheme();
  const parentRuntime = useZoraThemeRuntime();
  const { activeFontId } = useFontContext();
  const scopedThemeId = resolveZoraScopedThemeId({
    desiredThemeId: themeId,
    inheritedThemeId: parentRuntime.themeId,
  });
  const scopedMode = mode ?? parentSurface.mode;
  const sourceConfig = parentSurface.theme.config;
  const scopedTheme = useMemo(
    () => createTheme(sourceConfig, scopedMode, activeFontId),
    [sourceConfig, scopedMode, activeFontId],
  );
  const scopedSurfaceValue = useMemo(
    () => ({
      theme: scopedTheme,
      mode: scopedMode,
      setMode: parentSurface.setMode,
      setThemeConfig: parentSurface.setThemeConfig,
      _hasProvider: true,
    }),
    [parentSurface.setMode, parentSurface.setThemeConfig, scopedMode, scopedTheme],
  );
  const scopedRuntimeValue = useMemo(
    () => ({ themeId: scopedThemeId }),
    [scopedThemeId],
  );

  return (
    <ZoraThemeRuntimeContext.Provider value={scopedRuntimeValue}>
      <ThemeContext.Provider value={scopedSurfaceValue}>{children}</ThemeContext.Provider>
    </ZoraThemeRuntimeContext.Provider>
  );
}

export function ZoraThemeScope({ children, themeId, mode }: ZoraThemeScopeProps) {
  if (mode === undefined && themeId === undefined) return children;
  return (
    <ZoraThemeScopeInner mode={mode} themeId={themeId}>
      {children}
    </ZoraThemeScopeInner>
  );
}
''', encoding='utf-8')

Path('src/theme/themeConfigScope.test.ts').write_text(r'''import { readFileSync } from 'node:fs';
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
''', encoding='utf-8')
