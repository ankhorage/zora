import type { Responsive } from '@ankhorage/surface';
import type React from 'react';
import type { AccessibilityRole, TextStyle } from 'react-native';

import type { ZoraColor, ZoraEmphasis } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type TextVariant = 'body' | 'lead' | 'bodySmall' | 'caption' | 'label' | 'eyebrow' | 'code';

export type TextColor = ZoraColor;
export type TextEmphasis = ZoraEmphasis;

export type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export type TextAlign = NonNullable<TextStyle['textAlign']>;

export interface TextProps extends ZoraBaseProps {
  children?: React.ReactNode;
  text?: string;
  i18nKey?: string;
  variant?: Responsive<TextVariant>;
  color?: Responsive<TextColor>;
  emphasis?: Responsive<TextEmphasis>;
  align?: Responsive<TextAlign>;
  weight?: Responsive<TextWeight>;
  italic?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  nativeID?: string;
}
