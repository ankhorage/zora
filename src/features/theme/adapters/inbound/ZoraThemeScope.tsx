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
  inverted?: boolean;
}

/*** Applies nested ZORA theme overrides through the public Surface theme scope. */
export function ZoraThemeScope({ children, themeId, mode, inverted }: ZoraThemeScopeProps) {
  if (mode === undefined && themeId === undefined && inverted === undefined) return children;
  return (
    <ZoraThemeScopeInner mode={mode} themeId={themeId} inverted={inverted}>
      {children}
    </ZoraThemeScopeInner>
  );
}

/*** Resolves and provides the scoped Surface and ZORA theme runtime values. */
function ZoraThemeScopeInner({ children, themeId, mode, inverted }: ZoraThemeScopeProps) {
  const parentRuntime = useZoraThemeRuntime();
  const scopedThemeId = resolveZoraScopedThemeId({
    desiredThemeId: themeId,
    inheritedThemeId: parentRuntime.themeId,
  });
  const scopedRuntimeValue = useMemo(() => ({ themeId: scopedThemeId }), [scopedThemeId]);
  const scopedChildren =
    mode === undefined && inverted === undefined ? (
      children
    ) : (
      <ThemeScope mode={mode} inverted={inverted}>
        {children}
      </ThemeScope>
    );

  return (
    <ZoraThemeRuntimeContext value={scopedRuntimeValue}>{scopedChildren}</ZoraThemeRuntimeContext>
  );
}
