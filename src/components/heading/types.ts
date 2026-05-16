import type { Responsive } from '@ankhorage/surface';
import type React from 'react';
import type { AccessibilityRole, TextStyle } from 'react-native';

import type { ZoraColor, ZoraEmphasis } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingColor = ZoraColor;
export type HeadingEmphasis = ZoraEmphasis;

export type HeadingAlign = NonNullable<TextStyle['textAlign']>;

export type HeadingWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export interface HeadingProps extends ZoraBaseProps {
  children?: React.ReactNode;
  text?: string;
  i18nKey?: string;
  level?: HeadingLevel;
  size?: Responsive<HeadingSize>;
  color?: Responsive<HeadingColor>;
  emphasis?: Responsive<HeadingEmphasis>;
  align?: Responsive<HeadingAlign>;
  weight?: Responsive<HeadingWeight>;
  italic?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  nativeID?: string;
}
