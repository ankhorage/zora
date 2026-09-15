import { ThemeScope } from '@ankhorage/surface';
import React, { useMemo } from 'react';

import type { ZoraThemeId, ZoraThemeMode } from '../../../../types/theme';
import {
  useZoraThemeRuntime,
  ZoraThemeRuntimeContext,
} from '../../composition/ZoraThemeRuntimeContext';
import { resolveZoraScopedThemeId } from '../../utils/resolveZoraScopedThemeId';

export interface ZoraThemeScopeProps {
  children: React.ReactNode;
  themeId?: ZoraThemeId;
  mode?: ZoraThemeMode;
}

/*** Applies nested ZORA theme overrides through the public Surface theme scope. */
export function ZoraThemeScope({ children, themeId, mode }: ZoraThemeScopeProps) {
  if (mode === undefined && themeId === undefined) return children;
  return (
    <ZoraThemeScopeInner mode={mode} themeId={themeId}>
      {children}
    </ZoraThemeScopeInner>
  );
}

/*** Resolves and provides the scoped Surface and ZORA theme runtime values. */
function ZoraThemeScopeInner({ children, themeId, mode }: ZoraThemeScopeProps) {
  const parentRuntime = useZoraThemeRuntime();
  const scopedThemeId = resolveZoraScopedThemeId({
    desiredThemeId: themeId,
    inheritedThemeId: parentRuntime.themeId,
  });
  const scopedRuntimeValue = useMemo(() => ({ themeId: scopedThemeId }), [scopedThemeId]);
  const scopedChildren =
    mode === undefined ? children : <ThemeScope mode={mode}>{children}</ThemeScope>;

  return (
    <ZoraThemeRuntimeContext value={scopedRuntimeValue}>{scopedChildren}</ZoraThemeRuntimeContext>
  );
}
