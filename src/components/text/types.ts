import type { Responsive } from '@ankhorage/surface';
import type React from 'react';
import type { AccessibilityRole, TextStyle } from 'react-native';

export type TextVariant = 'body' | 'lead' | 'bodySmall' | 'caption' | 'label' | 'eyebrow' | 'code';

export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'inverse'
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning';

export type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export type TextAlign = NonNullable<TextStyle['textAlign']>;

export interface TextProps {
  children?: React.ReactNode;
  text?: string;
  i18nKey?: string;
  variant?: Responsive<TextVariant>;
  tone?: Responsive<TextTone>;
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
  testID?: string;
}
