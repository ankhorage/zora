import { createContext, useContext } from 'react';

import type { ZoraTheme, ZoraThemeId } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

interface ZoraThemeRuntime {
  sourceTheme: ZoraTheme;
  themeId: ZoraThemeId;
}

export const ZoraThemeRuntimeContext = createContext<ZoraThemeRuntime>({
  sourceTheme: zoraDefaultTheme,
  themeId: zoraDefaultTheme.id,
});

export function useZoraThemeRuntime(): ZoraThemeRuntime {
  return useContext(ZoraThemeRuntimeContext);
}
