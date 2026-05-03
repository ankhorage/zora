import { resolveResponsive, useResponsiveRuntime, useTranslationContext } from '@ankhorage/surface';
import React from 'react';
import { Text as ReactNativeText } from 'react-native';

import { useZoraTheme } from '../../theme/useZoraTheme';
import { resolveHeadingRecipe, resolveHeadingSizeFromLevel } from './resolveHeadingRecipe';
import type { HeadingProps } from './types';

function resolveHeadingContent({
  children,
  text,
  i18nKey,
  translate,
}: {
  children: HeadingProps['children'];
  text: HeadingProps['text'];
  i18nKey: HeadingProps['i18nKey'];
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
    console.warn('[ZoraHeading] Translation error:', error);
    return i18nKey;
  }
}

export function Heading({
  children,
  text,
  i18nKey,
  level = 2,
  size,
  tone = 'default',
  align,
  weight,
  italic = false,
  numberOfLines,
  ellipsizeMode,
  selectable,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'header',
  nativeID,
  testID,
}: HeadingProps) {
  const { theme } = useZoraTheme();
  const { breakpoint } = useResponsiveRuntime();
  const { t } = useTranslationContext();
  const content = resolveHeadingContent({ children, text, i18nKey, translate: t });
  const resolvedSize = resolveResponsive(size, breakpoint) ?? resolveHeadingSizeFromLevel(level);
  const resolvedTone = resolveResponsive(tone, breakpoint) ?? 'default';
  const resolvedAlign = resolveResponsive(align, breakpoint);
  const resolvedWeight = resolveResponsive(weight, breakpoint);

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
      style={resolveHeadingRecipe(theme, {
        align: resolvedAlign,
        italic,
        level,
        size: resolvedSize,
        tone: resolvedTone,
        weight: resolvedWeight,
      })}
    >
      {content}
    </ReactNativeText>
  );
}
