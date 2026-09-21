import { ThemeProvider, useTheme as useSurfaceTheme } from '@ankhorage/surface';
import React from 'react';

import type { ZoraProviderProps } from '../../../../types/provider';
import { createZoraThemeConfig } from '../../application/use-cases/createZoraThemeConfig';
import { ZoraRuntimeCapabilities } from '../../composition/ZoraRuntimeCapabilities';
import { ZoraThemeRuntimeContext } from '../../composition/ZoraThemeRuntimeContext';
import { zoraDefaultTheme } from '../../zoraDefaultTheme';

export type { ZoraProviderProps, ZoraToastCapability } from '../../../../types/provider';

/*** Installs the core ZORA theme runtime and explicitly enabled optional capabilities. */
export function ZoraProvider({
  bottomSheet = false,
  children,
  theme = zoraDefaultTheme,
  themeConfig,
  initialMode = 'light',
  mode,
  toast = false,
}: ZoraProviderProps) {
  const resolvedConfig = React.useMemo(
    () => themeConfig ?? createZoraThemeConfig(theme),
    [theme, themeConfig],
  );
  const runtimeValue = React.useMemo(() => ({ themeId: resolvedConfig.id }), [resolvedConfig.id]);

  return (
    <ZoraThemeRuntimeContext value={runtimeValue}>
      <ThemeProvider initialConfig={resolvedConfig} initialMode={mode ?? initialMode}>
        <ZoraProviderMode mode={mode}>
          <ZoraRuntimeCapabilities bottomSheet={bottomSheet} toast={toast}>
            {children}
          </ZoraRuntimeCapabilities>
        </ZoraProviderMode>
      </ThemeProvider>
    </ZoraThemeRuntimeContext>
  );
}

/*** Keep the shared Surface runtime aligned with a controlled application mode. */
function ZoraProviderMode({ children, mode }: Pick<ZoraProviderProps, 'children' | 'mode'>) {
  const runtime = useSurfaceTheme();
  React.useEffect(() => {
    if (mode !== undefined && runtime.mode !== mode) runtime.setMode(mode);
  }, [mode, runtime]);
  return children;
}
