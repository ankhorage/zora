import { resolveResponsive, useResponsiveRuntime, useTranslationContext } from '@ankhorage/surface';
import React from 'react';
import { Text as ReactNativeText } from 'react-native';

import { useZoraTheme } from '../../theme/useZoraTheme';
import { resolveTextStyle } from './resolveTextRecipe';
import type { TextProps } from './types';

function resolveTextContent({
  children,
  text,
  i18nKey,
  translate,
}: {
  children: TextProps['children'];
  text: TextProps['text'];
  i18nKey: TextProps['i18nKey'];
  translate: (key: string) => string;
}): React.ReactNode {
  if (children !== undefined) {
    return children;
  }

  if (text !== undefined) {
    return text;
  }

  if (!i18nKey) {
    return null;
  }

  try {
    const translated = translate(i18nKey);
    return translated && translated !== i18nKey ? translated : i18nKey;
  } catch (error) {
    console.warn('[ZoraText] Translation error:', error);
    return i18nKey;
  }
}

export function Text({
  children,
  text,
  i18nKey,
  variant = 'body',
  tone = 'default',
  align,
  weight,
  italic = false,
  numberOfLines,
  ellipsizeMode,
  selectable,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  nativeID,
  testID,
}: TextProps) {
  const { theme } = useZoraTheme();
  const { breakpoint } = useResponsiveRuntime();
  const { t } = useTranslationContext();
  const content = resolveTextContent({ children, text, i18nKey, translate: t });
  const resolvedVariant = resolveResponsive(variant, breakpoint) ?? 'body';
  const resolvedStyle = resolveTextStyle({
    theme,
    breakpoint,
    variant: resolvedVariant,
    tone,
    align,
    weight,
    italic,
  });

  if (content === null || content === undefined) {
    return null;
  }

  return (
    <ReactNativeText
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      ellipsizeMode={ellipsizeMode}
      nativeID={nativeID}
      numberOfLines={numberOfLines}
      selectable={selectable}
      testID={testID}
      style={resolvedStyle}
    >
      {content}
    </ReactNativeText>
  );
}
