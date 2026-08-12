import { resolveResponsive, useResponsiveRuntime } from '@ankhorage/surface';
import React from 'react';
import { Platform, Text as ReactNativeText, type TextStyle } from 'react-native';

import { useZoraTheme } from '../../theme/useZoraTheme';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveHeadingRecipe, resolveHeadingSizeFromLevel } from './resolveHeadingRecipe';
import { resolveHeadingThemeRecipe } from './resolveHeadingThemeRecipe';
import type { HeadingProps } from './types';

const headingLayoutStyle = {
  flexShrink: 1,
  maxWidth: '100%',
  minWidth: 0,
  ...(Platform.OS === 'web'
    ? {
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
        wordBreak: 'normal',
      }
    : null),
} as unknown as TextStyle;

function resolveHeadingContent({
  children,
  text,
  i18nKey,
}: Pick<HeadingProps, 'children' | 'text' | 'i18nKey'>) {
  if (children !== undefined) return children;
  if (text !== undefined) return text;
  if (i18nKey === undefined || i18nKey === '') return null;
  return i18nKey;
}

function HeadingInner({
  themeId: _themeId,
  mode: _mode,
  children,
  text,
  i18nKey,
  level = 2,
  size,
  color,
  emphasis,
  align,
  weight,
  italic,
  numberOfLines,
  ellipsizeMode,
  selectable,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  nativeID,
  testID,
  interactionPolicy: _interactionPolicy,
}: HeadingProps) {
  const { theme } = useZoraTheme();
  const { breakpoint } = useResponsiveRuntime();
  const themeRecipe = resolveHeadingThemeRecipe(useZoraThemeRecipe('Heading'));
  const content = resolveHeadingContent({ children, text, i18nKey });
  const resolvedSize =
    resolveResponsive(size ?? themeRecipe.size, breakpoint) ?? resolveHeadingSizeFromLevel(level);
  const resolvedColor = resolveResponsive(color ?? themeRecipe.color, breakpoint);
  const resolvedEmphasis =
    resolveResponsive(emphasis ?? themeRecipe.emphasis, breakpoint) ?? 'default';
  const resolvedAlign = resolveResponsive(align ?? themeRecipe.align, breakpoint);
  const resolvedWeight = resolveResponsive(weight ?? themeRecipe.weight, breakpoint);

  if (content === null) return null;

  return (
    <ReactNativeText
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? 'header'}
      ellipsizeMode={ellipsizeMode}
      nativeID={nativeID}
      numberOfLines={numberOfLines}
      selectable={selectable}
      testID={testID}
      style={[
        headingLayoutStyle,
        resolveHeadingRecipe(theme, {
          align: resolvedAlign,
          italic: italic ?? themeRecipe.italic ?? false,
          level,
          size: resolvedSize,
          color: resolvedColor,
          emphasis: resolvedEmphasis,
          weight: resolvedWeight,
        }),
        style,
      ]}
    >
      {content}
    </ReactNativeText>
  );
}

/***
 * Structured title primitive for accessible page, section, and card headings.
 *
 * `Heading` gives consumers a ZORA-owned title API with semantic levels,
 * responsive sizes, and theme-aware emphasis while preserving header semantics.
 *
 * @example Section title
 * ```tsx
 * <Heading level={2} size="xl">Account settings</Heading>
 * ```
 */
export const Heading = withZoraThemeScope(HeadingInner);
