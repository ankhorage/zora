import { createContext, useContext } from 'react';

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
