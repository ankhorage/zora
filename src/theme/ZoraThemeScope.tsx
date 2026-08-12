import { createTheme, ThemeContext, useFontContext, useTheme } from '@ankhorage/surface';
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
  const scopedRuntimeValue = useMemo(() => ({ themeId: scopedThemeId }), [scopedThemeId]);

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
