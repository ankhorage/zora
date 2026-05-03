import { createTheme, ThemeContext, useFontContext, useTheme } from '@ankhorage/surface';
import React, { useMemo } from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
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

  // Plan 2: there is no multi-theme registry yet. Keep the active theme seed inherited.
  const surfaceConfig = useMemo(
    () => createZoraThemeConfig(parentRuntime.sourceTheme),
    [parentRuntime.sourceTheme],
  );

  const scopedTheme = useMemo(
    () => createTheme(surfaceConfig, scopedMode, activeFontId),
    [surfaceConfig, scopedMode, activeFontId],
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
    () => ({
      sourceTheme: parentRuntime.sourceTheme,
      themeId: scopedThemeId,
    }),
    [parentRuntime.sourceTheme, scopedThemeId],
  );

  return (
    <ZoraThemeRuntimeContext.Provider value={scopedRuntimeValue}>
      <ThemeContext.Provider value={scopedSurfaceValue}>{children}</ThemeContext.Provider>
    </ZoraThemeRuntimeContext.Provider>
  );
}

export function ZoraThemeScope({ children, themeId, mode }: ZoraThemeScopeProps) {
  if (mode === undefined && themeId === undefined) {
    return children;
  }

  return (
    <ZoraThemeScopeInner mode={mode} themeId={themeId}>
      {children}
    </ZoraThemeScopeInner>
  );
}
