import type {
  ActionSheetItemProps as SurfaceActionSheetItemProps,
  ActionSheetProps as SurfaceActionSheetProps,
  ButtonIconSpec,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraColor } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ActionSheetProps
  extends ZoraBaseProps, Omit<SurfaceActionSheetProps, 'children' | 'mode' | 'themeId'> {
  children?: React.ReactNode;
}

export interface ActionSheetItemProps
  extends
    ZoraBaseProps,
    Omit<SurfaceActionSheetItemProps, 'color' | 'leading' | 'mode' | 'themeId'> {
  color?: ZoraColor;
  icon?: ButtonIconSpec;
  leading?: React.ReactNode;
}
