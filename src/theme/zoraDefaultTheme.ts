import { parseHexColorOrThrow } from '@ankhorage/color-theory';

import type { ZoraTheme } from './types';

export const zoraDefaultTheme: ZoraTheme = {
  id: 'zora',
  name: 'ZORA',
  appCategory: 'developer_tools',
  primaryColor: parseHexColorOrThrow('#0f766e'),
  harmony: 'analogous',
};
