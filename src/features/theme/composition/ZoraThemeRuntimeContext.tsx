import { createContext, use } from 'react';

import type { ZoraThemeId } from '../../../types/theme';
import { zoraDefaultTheme } from '../zoraDefaultTheme';

interface ZoraThemeRuntime {
  themeId: ZoraThemeId;
}

export const ZoraThemeRuntimeContext = createContext<ZoraThemeRuntime>({
  themeId: zoraDefaultTheme.id,
});

/*** Returns the active ZORA theme runtime. */
export function useZoraThemeRuntime(): ZoraThemeRuntime {
  return use(ZoraThemeRuntimeContext);
}
