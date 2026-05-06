import type { AppCategory } from '@ankhorage/contracts';

import type { ZoraTheme, ZoraThemeMode } from '../../theme/types';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ThemeComposerProps extends ZoraBaseProps {
  value: ZoraTheme;
  onChange: (theme: ZoraTheme) => void;
  mode?: ZoraThemeMode;
  onModeChange?: (mode: ZoraThemeMode) => void;
  onSubmit?: (theme: ZoraTheme) => void;
  appCategories?: readonly AppCategory[];
}
