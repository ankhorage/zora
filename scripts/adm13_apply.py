from pathlib import Path
import json

FILES = {
"src/metadata/themeRecipeTypes.ts": r'''export const ZORA_THEME_TOKEN_FAMILIES = [
  'colors',
  'spacing',
  'radii',
  'typography',
  'shadows',
] as const;

export type ZoraThemeTokenFamily = (typeof ZORA_THEME_TOKEN_FAMILIES)[number];

export type ZoraThemeRecipeKind = 'component' | 'pattern';

interface ZoraThemeRecipeFieldBase {
  readonly label: string;
  readonly description?: string;
}

export interface ZoraThemeRecipeTokenFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'token';
  readonly tokenFamily: ZoraThemeTokenFamily;
  readonly default?: string;
}

export interface ZoraThemeRecipeChoiceFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'choice';
  readonly options: readonly string[];
  readonly default?: string;
}

export interface ZoraThemeRecipeBooleanFieldMeta extends ZoraThemeRecipeFieldBase {
  readonly type: 'boolean';
  readonly default?: boolean;
}

export type ZoraThemeRecipeFieldMeta =
  | ZoraThemeRecipeTokenFieldMeta
  | ZoraThemeRecipeChoiceFieldMeta
  | ZoraThemeRecipeBooleanFieldMeta;

export interface ZoraThemeRecipeMeta {
  readonly name: string;
  readonly kind: ZoraThemeRecipeKind;
  readonly description?: string;
  readonly fields: Readonly<Record<string, ZoraThemeRecipeFieldMeta>>;
}

export type ZoraThemeRecipeMetaRegistry = Readonly<Record<string, ZoraThemeRecipeMeta>>;
''',
"src/metadata/themeRecipeMeta.ts": r'''import { buttonThemeRecipeMeta } from '../components/button/themeRecipeMeta';
import { cardThemeRecipeMeta } from '../components/card/themeRecipeMeta';
import { headingThemeRecipeMeta } from '../components/heading/themeRecipeMeta';
import { textThemeRecipeMeta } from '../components/text/themeRecipeMeta';
import { panelThemeRecipeMeta } from '../patterns/panel/themeRecipeMeta';
import type { ZoraThemeRecipeMetaRegistry } from './themeRecipeTypes';

export const ZORA_THEME_RECIPE_META: ZoraThemeRecipeMetaRegistry = {
  Button: buttonThemeRecipeMeta,
  Card: cardThemeRecipeMeta,
  Heading: headingThemeRecipeMeta,
  Text: textThemeRecipeMeta,
  Panel: panelThemeRecipeMeta,
};
''',
"src/components/button/themeRecipeMeta.ts": r'''import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const buttonThemeRecipeMeta = {
  name: 'Button',
  kind: 'component',
  description: 'Maps shared semantic choices into Button presentation defaults.',
  fields: {
    color: {
      type: 'choice',
      label: 'Color',
      options: ZORA_COLORS,
      default: 'primary',
    },
    variant: {
      type: 'choice',
      label: 'Variant',
      options: ['solid', 'outline', 'ghost', 'soft'],
      default: 'solid',
    },
    size: {
      type: 'choice',
      label: 'Size',
      description: 'A Button-specific semantic scale, not a universal pixel size.',
      options: ['s', 'm', 'l'],
      default: 'l',
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
''',
"src/components/card/themeRecipeMeta.ts": r'''import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const cardThemeRecipeMeta = {
  name: 'Card',
  kind: 'component',
  description: 'Maps global rhythm and surface tokens into Card presentation.',
  fields: {
    tone: {
      type: 'choice',
      label: 'Tone',
      options: ['default', 'subtle', 'outline'],
      default: 'default',
    },
    padding: {
      type: 'token',
      tokenFamily: 'spacing',
      label: 'Padding',
      description: 'When unset, Card keeps its compact-aware spacing default.',
    },
    radius: {
      type: 'token',
      tokenFamily: 'radii',
      label: 'Corner radius',
      default: 'l',
    },
    compact: {
      type: 'boolean',
      label: 'Compact',
      default: false,
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
''',
"src/components/heading/themeRecipeMeta.ts": r'''import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const headingThemeRecipeMeta = {
  name: 'Heading',
  kind: 'component',
  description: 'Maps Heading presentation defaults without replacing semantic heading levels.',
  fields: {
    size: {
      type: 'choice',
      label: 'Size',
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    color: { type: 'choice', label: 'Color', options: ZORA_COLORS },
    emphasis: {
      type: 'choice',
      label: 'Emphasis',
      options: ZORA_EMPHASES,
      default: 'default',
    },
    align: {
      type: 'choice',
      label: 'Align',
      options: ['auto', 'left', 'right', 'center', 'justify'],
    },
    weight: {
      type: 'choice',
      label: 'Weight',
      options: ['regular', 'medium', 'semiBold', 'bold'],
    },
    italic: { type: 'boolean', label: 'Italic', default: false },
  },
} as const satisfies ZoraThemeRecipeMeta;
''',
"src/components/text/themeRecipeMeta.ts": r'''import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const textThemeRecipeMeta = {
  name: 'Text',
  kind: 'component',
  description: 'Maps semantic Text presentation defaults into runtime props.',
  fields: {
    variant: {
      type: 'choice',
      label: 'Typography variant',
      options: ['body', 'lead', 'bodySmall', 'caption', 'label', 'eyebrow', 'code'],
      default: 'body',
    },
    color: { type: 'choice', label: 'Color', options: ZORA_COLORS },
    emphasis: {
      type: 'choice',
      label: 'Emphasis',
      options: ZORA_EMPHASES,
      default: 'default',
    },
    align: {
      type: 'choice',
      label: 'Align',
      options: ['auto', 'left', 'right', 'center', 'justify'],
    },
    weight: {
      type: 'choice',
      label: 'Weight',
      options: ['regular', 'medium', 'semiBold', 'bold'],
    },
    italic: { type: 'boolean', label: 'Italic', default: false },
  },
} as const satisfies ZoraThemeRecipeMeta;
''',
"src/patterns/panel/themeRecipeMeta.ts": r'''import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const panelThemeRecipeMeta = {
  name: 'Panel',
  kind: 'pattern',
  description: 'Maps global rhythm and surface tokens into Panel presentation.',
  fields: {
    tone: {
      type: 'choice',
      label: 'Tone',
      options: ['default', 'subtle', 'outline'],
      default: 'default',
    },
    padding: {
      type: 'token',
      tokenFamily: 'spacing',
      label: 'Padding',
      description: 'When unset, Panel keeps Card compact-aware spacing.',
    },
    radius: {
      type: 'token',
      tokenFamily: 'radii',
      label: 'Corner radius',
      default: 'l',
    },
    compact: {
      type: 'boolean',
      label: 'Compact',
      default: false,
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
''',
"src/theme/resolveZoraThemeRecipe.ts": r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';
import type { SurfaceTheme } from '@ankhorage/surface';

import { ZORA_THEME_RECIPE_META } from '../metadata/themeRecipeMeta';
import type { ZoraThemeRecipeFieldMeta, ZoraThemeTokenFamily } from '../metadata/themeRecipeTypes';

export function resolveZoraThemeRecipe(
  theme: SurfaceTheme,
  recipeName: string,
): Readonly<Record<string, ThemeRecipeOverrideValue>> {
  const meta = ZORA_THEME_RECIPE_META[recipeName];
  if (!meta) throw new RangeError(`Unknown ZORA theme recipe: ${recipeName}.`);

  const overrides =
    meta.kind === 'component'
      ? theme.config.recipes?.components?.[recipeName]
      : theme.config.recipes?.patterns?.[recipeName];
  const resolved: Record<string, ThemeRecipeOverrideValue> = {};

  for (const [fieldName, fieldMeta] of Object.entries(meta.fields)) {
    const override = overrides?.[fieldName];
    if (override !== undefined) {
      validateFieldValue(theme, recipeName, fieldName, fieldMeta, override);
      resolved[fieldName] = override;
    } else if (fieldMeta.default !== undefined) {
      resolved[fieldName] = fieldMeta.default;
    }
  }

  return resolved;
}

function validateFieldValue(
  theme: SurfaceTheme,
  recipeName: string,
  fieldName: string,
  meta: ZoraThemeRecipeFieldMeta,
  value: ThemeRecipeOverrideValue,
): void {
  if (meta.type === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new TypeError(`Theme recipe ${recipeName}.${fieldName} must be boolean.`);
    }
    return;
  }
  if (typeof value !== 'string') {
    throw new TypeError(`Theme recipe ${recipeName}.${fieldName} must be a string.`);
  }
  if (meta.type === 'choice' && !meta.options.includes(value)) {
    throw new RangeError(`Invalid theme recipe choice for ${recipeName}.${fieldName}: ${value}.`);
  }
  if (meta.type === 'token' && !hasThemeToken(theme, meta.tokenFamily, value)) {
    throw new RangeError(
      `Unknown ${meta.tokenFamily} token for ${recipeName}.${fieldName}: ${value}.`,
    );
  }
}

function hasThemeToken(theme: SurfaceTheme, family: ZoraThemeTokenFamily, token: string): boolean {
  if (family === 'colors') return hasOwn(theme.colors, token);
  if (family === 'spacing') return hasOwn(theme.spacing, token);
  if (family === 'radii') return hasOwn(theme.radii, token);
  if (family === 'shadows') return hasOwn(theme.shadows, token);
  return (
    hasOwn(theme.typography.sizes, token) ||
    hasOwn(theme.typography.weights, token) ||
    hasOwn(theme.typography.headings, token)
  );
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}
''',
"src/theme/useZoraThemeRecipe.ts": r'''import { resolveZoraThemeRecipe } from './resolveZoraThemeRecipe';
import { useZoraTheme } from './useZoraTheme';

export function useZoraThemeRecipe(recipeName: string) {
  const { theme } = useZoraTheme();
  return resolveZoraThemeRecipe(theme, recipeName);
}
''',
"src/components/button/resolveButtonThemeRecipe.ts": r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import {
  resolveButtonRecipe,
  type ZoraButtonVariant,
  type ZoraColor,
  type ZoraControlSize,
} from '../../internal/recipes';

export function resolveButtonThemeRecipe(input: {
  readonly color?: ZoraColor;
  readonly variant?: ZoraButtonVariant;
  readonly size?: ZoraControlSize;
  readonly themeFields: Readonly<Record<string, ThemeRecipeOverrideValue>>;
}) {
  return resolveButtonRecipe({
    color: input.color ?? readColor(input.themeFields.color),
    variant: input.variant ?? readVariant(input.themeFields.variant),
    size: input.size ?? readSize(input.themeFields.size),
  });
}

function readColor(value: ThemeRecipeOverrideValue | undefined): ZoraColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') return value;
  return undefined;
}

function readVariant(value: ThemeRecipeOverrideValue | undefined): ZoraButtonVariant | undefined {
  if (value === 'solid' || value === 'outline' || value === 'ghost' || value === 'soft') return value;
  return undefined;
}

function readSize(value: ThemeRecipeOverrideValue | undefined): ZoraControlSize | undefined {
  if (value === 's' || value === 'm' || value === 'l') return value;
  return undefined;
}
''',
"src/components/card/resolveCardThemeRecipe.ts": r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { ZoraCardTone } from '../../internal/recipes';

export function resolveCardThemeRecipe(input: {
  readonly tone?: ZoraCardTone;
  readonly compact?: boolean;
  readonly padding?: string;
  readonly radius?: string;
  readonly themeFields: Readonly<Record<string, ThemeRecipeOverrideValue>>;
}) {
  const tone = input.tone ?? readTone(input.themeFields.tone) ?? 'default';
  const compact = input.compact ?? readBoolean(input.themeFields.compact) ?? false;
  return {
    tone,
    compact,
    padding: input.padding ?? readString(input.themeFields.padding) ?? (compact ? 'm' : 'l'),
    radius: input.radius ?? readString(input.themeFields.radius) ?? 'l',
  };
}

function readTone(value: ThemeRecipeOverrideValue | undefined): ZoraCardTone | undefined {
  if (value === 'default' || value === 'subtle' || value === 'outline') return value;
  return undefined;
}

function readBoolean(value: ThemeRecipeOverrideValue | undefined): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function readString(value: ThemeRecipeOverrideValue | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
''',
"src/components/text/resolveTextThemeRecipe.ts": r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { TextAlign, TextColor, TextEmphasis, TextVariant, TextWeight } from './types';

export function resolveTextThemeRecipe(fields: Readonly<Record<string, ThemeRecipeOverrideValue>>) {
  return {
    variant: readVariant(fields.variant),
    color: readColor(fields.color),
    emphasis: readEmphasis(fields.emphasis),
    align: readAlign(fields.align),
    weight: readWeight(fields.weight),
    italic: typeof fields.italic === 'boolean' ? fields.italic : undefined,
  };
}

function readVariant(value: ThemeRecipeOverrideValue | undefined): TextVariant | undefined {
  if (value === 'body' || value === 'lead' || value === 'bodySmall' || value === 'caption') return value;
  if (value === 'label' || value === 'eyebrow' || value === 'code') return value;
  return undefined;
}

function readColor(value: ThemeRecipeOverrideValue | undefined): TextColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') return value;
  return undefined;
}

function readEmphasis(value: ThemeRecipeOverrideValue | undefined): TextEmphasis | undefined {
  if (value === 'default' || value === 'muted' || value === 'subtle' || value === 'inverse') return value;
  return undefined;
}

function readAlign(value: ThemeRecipeOverrideValue | undefined): TextAlign | undefined {
  if (value === 'auto' || value === 'left' || value === 'right') return value;
  if (value === 'center' || value === 'justify') return value;
  return undefined;
}

function readWeight(value: ThemeRecipeOverrideValue | undefined): TextWeight | undefined {
  if (value === 'regular' || value === 'medium' || value === 'semiBold' || value === 'bold') return value;
  return undefined;
}
''',
"src/components/heading/resolveHeadingThemeRecipe.ts": r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { HeadingAlign, HeadingColor, HeadingEmphasis, HeadingSize, HeadingWeight } from './types';

export function resolveHeadingThemeRecipe(fields: Readonly<Record<string, ThemeRecipeOverrideValue>>) {
  return {
    size: readSize(fields.size),
    color: readColor(fields.color),
    emphasis: readEmphasis(fields.emphasis),
    align: readAlign(fields.align),
    weight: readWeight(fields.weight),
    italic: typeof fields.italic === 'boolean' ? fields.italic : undefined,
  };
}

function readSize(value: ThemeRecipeOverrideValue | undefined): HeadingSize | undefined {
  if (value === 'display' || value === 'h1' || value === 'h2' || value === 'h3') return value;
  if (value === 'h4' || value === 'h5' || value === 'h6') return value;
  return undefined;
}

function readColor(value: ThemeRecipeOverrideValue | undefined): HeadingColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') return value;
  return undefined;
}

function readEmphasis(value: ThemeRecipeOverrideValue | undefined): HeadingEmphasis | undefined {
  if (value === 'default' || value === 'muted' || value === 'subtle' || value === 'inverse') return value;
  return undefined;
}

function readAlign(value: ThemeRecipeOverrideValue | undefined): HeadingAlign | undefined {
  if (value === 'auto' || value === 'left' || value === 'right') return value;
  if (value === 'center' || value === 'justify') return value;
  return undefined;
}

function readWeight(value: ThemeRecipeOverrideValue | undefined): HeadingWeight | undefined {
  if (value === 'regular' || value === 'medium' || value === 'semiBold' || value === 'bold') return value;
  return undefined;
}
''',
"src/components/button/Button.tsx": r'''import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveButtonThemeRecipe } from './resolveButtonThemeRecipe';
import type { ButtonProps } from './types';

function ButtonInner({
  themeId: _themeId,
  mode: _mode,
  color,
  variant,
  size,
  interactionPolicy,
  ...props
}: ButtonProps) {
  const themeFields = useZoraThemeRecipe('Button');
  const recipe = resolveButtonThemeRecipe({ color, variant, size, themeFields });

  return (
    <SurfaceButton
      {...props}
      color={recipe.color}
      size={recipe.size}
      variant={recipe.variant}
      interactionPolicy={interactionPolicy}
    />
  );
}

/***
 * Theme-aware action control for primary, secondary, destructive, and neutral actions.
 *
 * Use `Button` for explicit user actions that should follow ZORA's semantic color,
 * variant, and size recipes across React Native and React Native Web.
 *
 * @example Basic action
 * ```tsx
 * <Button color="primary" variant="solid" onPress={save}>Save</Button>
 * ```
 */
export const Button = withZoraThemeScope(ButtonInner);
''',
"src/components/card/types.ts": r'''import type { CardProps as SurfaceCardProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraCardTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface CardProps
  extends ZoraBaseProps, Omit<SurfaceCardProps, 'children' | 'p' | 'radius' | 'variant'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  padding?: string;
  radius?: string;
}
''',
"src/components/card/Card.tsx": r'''import { Card as SurfaceCard } from '@ankhorage/surface';
import React from 'react';

import { Box, Stack } from '../../foundation';
import { resolveCardVariant } from '../../internal/recipes';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { Text } from '../text';
import { resolveCardThemeRecipe } from './resolveCardThemeRecipe';
import type { CardProps } from './types';

function CardInner({
  themeId: _themeId,
  mode: _mode,
  children,
  title,
  description,
  eyebrow,
  actions,
  footer,
  tone,
  compact,
  padding,
  radius,
  onPress,
  interactionPolicy,
  ...props
}: CardProps) {
  const themeFields = useZoraThemeRecipe('Card');
  const recipe = resolveCardThemeRecipe({ tone, compact, padding, radius, themeFields });
  const hasHeader = [eyebrow, title, description, actions].some((item) => item != null);
  const hasFooter = footer !== undefined;
  const gap = recipe.compact ? 's' : 'm';
  const isInteractive = Boolean(onPress) && !actions;
  const passive = interactionPolicy === 'passive';

  return (
    <SurfaceCard
      {...props}
      onPress={isInteractive && !passive ? onPress : undefined}
      p={recipe.padding}
      radius={recipe.radius}
      variant={resolveCardVariant(recipe.tone)}
    >
      <Stack gap={gap}>
        {hasHeader ? (
          <Stack
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap="m"
            justify="space-between"
          >
            <Box flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
              <Stack gap="xs">
                {eyebrow ? (
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {eyebrow}
                  </Text>
                ) : null}
                {title ? <Heading level={recipe.compact ? 4 : 3}>{title}</Heading> : null}
                {description ? (
                  <Text emphasis="muted" variant="bodySmall">
                    {description}
                  </Text>
                ) : null}
              </Stack>
            </Box>
            {actions ? <Box>{actions}</Box> : null}
          </Stack>
        ) : null}

        {children ? <Box>{children}</Box> : null}

        {hasFooter ? <Box pt="xs">{footer}</Box> : null}
      </Stack>
    </SurfaceCard>
  );
}

/***
 * Structured content container with built-in heading, description, actions, and footer slots.
 *
 * Use `Card` for reusable content blocks that should inherit ZORA spacing,
 * radius, tone, and responsive header layout without hand-assembling primitives.
 *
 * @example Content card
 * ```tsx
 * <Card title="Project" description="Latest activity">...</Card>
 * ```
 */
export const Card = withZoraThemeScope(CardInner);
''',
"src/components/text/Text.tsx": r'''import { resolveResponsive, useResponsiveRuntime } from '@ankhorage/surface';
import React from 'react';
import { Platform, Text as ReactNativeText, type TextStyle } from 'react-native';

import { useZoraTheme } from '../../theme/useZoraTheme';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { resolveTextStyle } from './resolveTextRecipe';
import { resolveTextThemeRecipe } from './resolveTextThemeRecipe';
import type { TextProps } from './types';

const textLayoutStyle = {
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

function resolveTextContent({
  children,
  text,
  i18nKey,
}: {
  children: TextProps['children'];
  text: TextProps['text'];
  i18nKey: TextProps['i18nKey'];
}): React.ReactNode {
  if (children !== undefined) return children;
  if (text !== undefined) return text;
  return i18nKey || null;
}

function TextInner({
  themeId: _themeId,
  mode: _mode,
  children,
  text,
  i18nKey,
  variant,
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
}: TextProps) {
  const { theme } = useZoraTheme();
  const { breakpoint } = useResponsiveRuntime();
  const themeRecipe = resolveTextThemeRecipe(useZoraThemeRecipe('Text'));
  const content = resolveTextContent({ children, text, i18nKey });
  const resolvedVariant = resolveResponsive(variant ?? themeRecipe.variant, breakpoint) ?? 'body';
  const resolvedStyle = resolveTextStyle({
    theme,
    breakpoint,
    variant: resolvedVariant,
    color: color ?? themeRecipe.color,
    emphasis: emphasis ?? themeRecipe.emphasis,
    align: align ?? themeRecipe.align,
    weight: weight ?? themeRecipe.weight,
    italic: italic ?? themeRecipe.italic ?? false,
  });

  if (content === null || content === undefined) return null;

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
      style={[textLayoutStyle, resolvedStyle, style]}
    >
      {content}
    </ReactNativeText>
  );
}

/***
 * Structured copy primitive for theme-aware app text.
 *
 * `Text` owns normal body, caption, label, code, and supporting-copy variants so
 * consumers do not need to import lower-level Surface typography directly.
 *
 * @example Muted supporting copy
 * ```tsx
 * <Text variant="bodySmall" emphasis="muted">Updated just now</Text>
 * ```
 */
export const Text = withZoraThemeScope(TextInner);
''',
"src/components/heading/Heading.tsx": r'''import { resolveResponsive, useResponsiveRuntime } from '@ankhorage/surface';
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

function resolveHeadingContent({ children, text, i18nKey }: Pick<HeadingProps, 'children' | 'text' | 'i18nKey'>) {
  if (children !== undefined) return children;
  if (text !== undefined) return text;
  return i18nKey || null;
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
  const resolvedEmphasis = resolveResponsive(emphasis ?? themeRecipe.emphasis, breakpoint) ?? 'default';
  const resolvedAlign = resolveResponsive(align ?? themeRecipe.align, breakpoint);
  const resolvedWeight = resolveResponsive(weight ?? themeRecipe.weight, breakpoint);

  if (content === null || content === undefined) return null;

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
''',
"src/patterns/panel/types.ts": r'''import type React from 'react';

import type { ZoraCardTone } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface PanelProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  tone?: ZoraCardTone;
  compact?: boolean;
  padding?: string;
  radius?: string;
}
''',
"src/patterns/panel/Panel.tsx": r'''import React from 'react';

import { Card } from '../../components/card';
import { resolveCardThemeRecipe } from '../../components/card/resolveCardThemeRecipe';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { PanelProps } from './types';

function PanelInner({
  themeId: _themeId,
  mode: _mode,
  tone,
  compact,
  padding,
  radius,
  ...props
}: PanelProps) {
  const themeFields = useZoraThemeRecipe('Panel');
  const recipe = resolveCardThemeRecipe({ tone, compact, padding, radius, themeFields });
  return <Card {...props} {...recipe} />;
}

/***
 * Semantic wrapper around `Card` for panel-style page sections.
 */
export const Panel = withZoraThemeScope(PanelInner);
''',
"src/theme/ZoraThemeRuntimeContext.tsx": r'''import type { ThemeConfig } from '@ankhorage/contracts';
import { createContext, useContext } from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraThemeId } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

interface ZoraThemeRuntime {
  themeConfig: ThemeConfig;
  themeId: ZoraThemeId;
}

const defaultThemeConfig = createZoraThemeConfig(zoraDefaultTheme);

export const ZoraThemeRuntimeContext = createContext<ZoraThemeRuntime>({
  themeConfig: defaultThemeConfig,
  themeId: defaultThemeConfig.id,
});

export function useZoraThemeRuntime(): ZoraThemeRuntime {
  return useContext(ZoraThemeRuntimeContext);
}
''',
"src/theme/ZoraProvider.tsx": r'''import type { ThemeConfig } from '@ankhorage/contracts';
import { ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';
import { ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraProviderProps {
  children: React.ReactNode;
  theme?: ZoraTheme;
  themeConfig?: ThemeConfig;
  initialMode?: ZoraThemeMode;
}

/** Installs the ZORA theme runtime and underlying Surface theme provider. */
export function ZoraProvider({
  children,
  theme = zoraDefaultTheme,
  themeConfig,
  initialMode = 'light',
}: ZoraProviderProps) {
  const resolvedConfig = React.useMemo(
    () => themeConfig ?? createZoraThemeConfig(theme),
    [theme, themeConfig],
  );
  const runtimeValue = React.useMemo(
    () => ({ themeConfig: resolvedConfig, themeId: resolvedConfig.id }),
    [resolvedConfig],
  );

  return (
    <ZoraThemeRuntimeContext.Provider value={runtimeValue}>
      <ThemeProvider initialConfig={resolvedConfig} initialMode={initialMode}>
        {children}
      </ThemeProvider>
    </ZoraThemeRuntimeContext.Provider>
  );
}
''',
"src/theme/ZoraThemeScope.tsx": r'''import { createTheme, ThemeContext, useFontContext, useTheme } from '@ankhorage/surface';
import React, { useMemo } from 'react';

import { resolveZoraScopedThemeId } from './resolveZoraScopedThemeId';
import type { ZoraThemeId, ZoraThemeMode } from './types';
import { useZoraThemeRuntime, ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraThemeScopeProps {
  children: React.ReactNode;
  themeId?: ZoraThemeId;
  mode?: ZoraThemeMode;
}

function ZoraThemeScopeInner({ children, themeId, mode }: ZoraThemeScopeProps) {
  const parentSurface = useTheme();
  const parentRuntime = useZoraThemeRuntime();
  const { activeFontId } = useFontContext();
  const scopedThemeId = resolveZoraScopedThemeId({
    desiredThemeId: themeId,
    inheritedThemeId: parentRuntime.themeId,
  });
  const scopedMode = mode ?? parentSurface.mode;
  const scopedTheme = useMemo(
    () => createTheme(parentRuntime.themeConfig, scopedMode, activeFontId),
    [parentRuntime.themeConfig, scopedMode, activeFontId],
  );
  const scopedSurfaceValue = useMemo(
    () => ({
      theme: scopedTheme,
      mode: scopedMode,
      setMode: parentSurface.setMode,
      setThemeConfig: parentSurface.setThemeConfig,
      _hasProvider: true,
    }),
    [parentSurface.setMode, parentSurface.setThemeConfig, scopedMode, scopedTheme],
  );
  const scopedRuntimeValue = useMemo(
    () => ({ themeConfig: parentRuntime.themeConfig, themeId: scopedThemeId }),
    [parentRuntime.themeConfig, scopedThemeId],
  );

  return (
    <ZoraThemeRuntimeContext.Provider value={scopedRuntimeValue}>
      <ThemeContext.Provider value={scopedSurfaceValue}>{children}</ThemeContext.Provider>
    </ZoraThemeRuntimeContext.Provider>
  );
}

export function ZoraThemeScope({ children, themeId, mode }: ZoraThemeScopeProps) {
  if (mode === undefined && themeId === undefined) return children;
  return (
    <ZoraThemeScopeInner mode={mode} themeId={themeId}>
      {children}
    </ZoraThemeScopeInner>
  );
}
''',
"src/metadata/types.ts": r'''import type { ComponentEventDtoKind, ComponentRequirements } from '@ankhorage/contracts';

export type ZoraComponentCategory = 'foundation' | 'component' | 'pattern' | 'layout';

export type ZoraComponentPropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'color'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'typographySize'
  | 'typographyWeight'
  | 'action'
  | 'imageAsset'
  | 'array';

export type ZoraComponentPropValue =
  | string
  | number
  | boolean
  | null
  | readonly ZoraComponentPropValue[]
  | { readonly [key: string]: ZoraComponentPropValue };

export type ZoraComponentPropAuthoring =
  | { readonly authority: 'instance' }
  | {
      readonly authority: 'theme';
      readonly scope: 'global' | 'component' | 'pattern';
      readonly allowInstanceOverride?: boolean;
    };

export interface ZoraComponentPropArrayItemSchema {
  key: string;
  schema: ZoraComponentPropSchema;
}

export interface ZoraComponentPropSchema {
  type: ZoraComponentPropType;
  category: string;
  label?: string;
  enum?: readonly (string | number)[];
  default?: ZoraComponentPropValue;
  itemSchema?: readonly ZoraComponentPropArrayItemSchema[];
  authoring?: ZoraComponentPropAuthoring;
}

export interface ZoraComponentBlueprint {
  label: string;
  icon?: { name: string; provider?: string };
  defaultProps?: Readonly<Record<string, ZoraComponentPropValue>>;
}

export interface ZoraComponentI18nMeta {
  fields: readonly { keyProp: string; defaultTextProp: string }[];
}

export type ZoraComponentEventPayloadKind = ComponentEventDtoKind | (string & {});
export type ZoraComponentEventPayloadFieldType =
  | 'boolean'
  | 'number'
  | 'object'
  | 'record'
  | 'string'
  | 'unknown';

export interface ZoraComponentEventPayloadFieldMeta {
  readonly path: string;
  readonly type: ZoraComponentEventPayloadFieldType;
  readonly label?: string;
  readonly description?: string;
}

export interface ZoraComponentEventMeta {
  readonly label: string;
  readonly eventType: ZoraComponentEventPayloadKind;
  readonly description?: string;
  readonly payloadFields?: readonly ZoraComponentEventPayloadFieldMeta[];
}

export interface ZoraComponentSlotMeta {
  label?: string;
  allowedChildren?: readonly string[];
}

export interface ZoraComponentMeta {
  name: string;
  category: ZoraComponentCategory;
  description?: string;
  directManifestNode: boolean;
  allowedChildren: readonly string[];
  requirements?: ComponentRequirements;
  blueprint?: ZoraComponentBlueprint;
  events?: Readonly<Record<string, ZoraComponentEventMeta>>;
  i18n?: ZoraComponentI18nMeta;
  slots?: Readonly<Record<string, ZoraComponentSlotMeta>>;
  note?: string;
  props: Readonly<Record<string, ZoraComponentPropSchema>>;
}

export type ZoraComponentMetaRegistry = Readonly<Record<string, ZoraComponentMeta>>;
''',
"src/components/button/meta.ts": r'''import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = { authority: 'theme', scope: 'component', allowInstanceOverride: true } as const;

export const buttonMeta = {
  name: 'Button',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Button', defaultProps: { children: 'Continue' } },
  events: {
    press: {
      label: 'Press',
      eventType: 'button.press',
      description: 'Emitted when the button action runs.',
      payloadFields: [],
    },
  },
  props: {
    children: {
      type: 'string', category: 'Content', label: 'Label', default: 'Continue',
      authoring: { authority: 'instance' },
    },
    color: { type: 'enum', category: 'Style', label: 'Color', enum: [...ZORA_COLORS], authoring: themeAuthoring },
    variant: {
      type: 'enum', category: 'Style', label: 'Variant',
      enum: ['solid', 'outline', 'ghost', 'soft'], authoring: themeAuthoring,
    },
    size: { type: 'enum', category: 'Style', label: 'Size', enum: ['s', 'm', 'l'], authoring: themeAuthoring },
  },
} as const satisfies ZoraComponentMeta;
''',
"src/components/card/meta.ts": r'''import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

const themeAuthoring = { authority: 'theme', scope: 'component', allowInstanceOverride: true } as const;

export const cardMeta = {
  name: 'Card', category: 'component', directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: { label: 'Card', defaultProps: { title: 'Card' } },
  props: {
    title: { type: 'string', category: 'Content', label: 'Title', authoring: { authority: 'instance' } },
    description: { type: 'string', category: 'Content', label: 'Description', authoring: { authority: 'instance' } },
    eyebrow: { type: 'string', category: 'Content', label: 'Eyebrow', authoring: { authority: 'instance' } },
    tone: { type: 'enum', category: 'Style', label: 'Tone', enum: ['default', 'subtle', 'outline'], authoring: themeAuthoring },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', authoring: themeAuthoring },
    padding: { type: 'spacing', category: 'Layout', label: 'Padding', authoring: themeAuthoring },
    radius: { type: 'radius', category: 'Style', label: 'Corner radius', authoring: themeAuthoring },
  },
} as const satisfies ZoraComponentMeta;
''',
"src/components/text/meta.ts": r'''import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = { authority: 'theme', scope: 'component', allowInstanceOverride: true } as const;

export const textMeta = {
  name: 'Text', category: 'component', directManifestNode: true, allowedChildren: [],
  blueprint: { label: 'Text', defaultProps: { text: 'Text' } },
  i18n: { fields: [{ keyProp: 'i18nKey', defaultTextProp: 'text' }] },
  props: {
    text: { type: 'string', category: 'Content', label: 'Text', default: 'Text', authoring: { authority: 'instance' } },
    i18nKey: { type: 'string', category: 'Content', label: 'i18n key', authoring: { authority: 'instance' } },
    variant: { type: 'enum', category: 'Typography', label: 'Variant', enum: ['body', 'lead', 'bodySmall', 'caption', 'label', 'eyebrow', 'code'], authoring: themeAuthoring },
    color: { type: 'enum', category: 'Style', label: 'Color', enum: ZORA_COLORS, authoring: themeAuthoring },
    emphasis: { type: 'enum', category: 'Style', label: 'Emphasis', enum: ZORA_EMPHASES, authoring: themeAuthoring },
    align: { type: 'enum', category: 'Layout', label: 'Align', enum: ['auto', 'left', 'right', 'center', 'justify'], authoring: themeAuthoring },
    weight: { type: 'enum', category: 'Typography', label: 'Weight', enum: ['regular', 'medium', 'semiBold', 'bold'], authoring: themeAuthoring },
    italic: { type: 'boolean', category: 'Typography', label: 'Italic', authoring: themeAuthoring },
    numberOfLines: { type: 'number', category: 'Layout', label: 'Line clamp', authoring: { authority: 'instance' } },
  },
} as const satisfies ZoraComponentMeta;
''',
"src/components/heading/meta.ts": r'''import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = { authority: 'theme', scope: 'component', allowInstanceOverride: true } as const;

export const headingMeta = {
  name: 'Heading', category: 'component', directManifestNode: true, allowedChildren: [],
  blueprint: { label: 'Heading', defaultProps: { text: 'Heading', level: 2 } },
  i18n: { fields: [{ keyProp: 'i18nKey', defaultTextProp: 'text' }] },
  props: {
    text: { type: 'string', category: 'Content', label: 'Text', default: 'Heading', authoring: { authority: 'instance' } },
    i18nKey: { type: 'string', category: 'Content', label: 'i18n key', authoring: { authority: 'instance' } },
    level: { type: 'enum', category: 'Semantics', label: 'Level', enum: [1, 2, 3, 4, 5, 6], default: 2, authoring: { authority: 'instance' } },
    size: { type: 'enum', category: 'Typography', label: 'Size', enum: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], authoring: themeAuthoring },
    color: { type: 'enum', category: 'Style', label: 'Color', enum: ZORA_COLORS, authoring: themeAuthoring },
    emphasis: { type: 'enum', category: 'Style', label: 'Emphasis', enum: ZORA_EMPHASES, authoring: themeAuthoring },
    align: { type: 'enum', category: 'Layout', label: 'Align', enum: ['auto', 'left', 'right', 'center', 'justify'], authoring: themeAuthoring },
    weight: { type: 'enum', category: 'Typography', label: 'Weight', enum: ['regular', 'medium', 'semiBold', 'bold'], authoring: themeAuthoring },
    italic: { type: 'boolean', category: 'Typography', label: 'Italic', authoring: themeAuthoring },
    numberOfLines: { type: 'number', category: 'Layout', label: 'Line clamp', authoring: { authority: 'instance' } },
  },
} as const satisfies ZoraComponentMeta;
''',
"src/patterns/panel/meta.ts": r'''import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

const themeAuthoring = { authority: 'theme', scope: 'pattern', allowInstanceOverride: true } as const;

export const panelMeta = {
  name: 'Panel', category: 'pattern', directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: { label: 'Panel', defaultProps: { title: 'Panel' } },
  props: {
    title: { type: 'string', category: 'Content', label: 'Title', authoring: { authority: 'instance' } },
    description: { type: 'string', category: 'Content', label: 'Description', authoring: { authority: 'instance' } },
    eyebrow: { type: 'string', category: 'Content', label: 'Eyebrow', authoring: { authority: 'instance' } },
    tone: { type: 'enum', category: 'Style', label: 'Tone', enum: ['default', 'subtle', 'outline'], authoring: themeAuthoring },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', authoring: themeAuthoring },
    padding: { type: 'spacing', category: 'Layout', label: 'Padding', authoring: themeAuthoring },
    radius: { type: 'radius', category: 'Style', label: 'Corner radius', authoring: themeAuthoring },
  },
} as const satisfies ZoraComponentMeta;
''',
"src/metadata/themeRecipeMeta.test.ts": r'''import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META, ZORA_THEME_TOKEN_FAMILIES } from './index';

const tokenFamilies = new Set<string>(ZORA_THEME_TOKEN_FAMILIES);

describe('ZORA_THEME_RECIPE_META', () => {
  test('exports every current component/pattern theme-authority recipe', () => {
    expect(Object.keys(ZORA_THEME_RECIPE_META)).toEqual(['Button', 'Card', 'Heading', 'Text', 'Panel']);

    for (const [name, componentMeta] of Object.entries(ZORA_COMPONENT_META)) {
      const themeProps = Object.entries(componentMeta.props).filter(
        ([, prop]) => prop.authoring?.authority === 'theme' && prop.authoring.scope !== 'global',
      );
      if (themeProps.length === 0) continue;

      const recipe = ZORA_THEME_RECIPE_META[name];
      expect(recipe, `${name} has theme props but no theme recipe`).toBeDefined();
      expect(recipe?.kind).toBe(componentMeta.category === 'pattern' ? 'pattern' : 'component');
      for (const [propName] of themeProps) {
        expect(recipe?.fields[propName], `${name}.${propName} is missing from its recipe`).toBeDefined();
      }
    }
  });

  test('references only canonical token families and valid declared defaults', () => {
    for (const meta of Object.values(ZORA_THEME_RECIPE_META)) {
      for (const field of Object.values(meta.fields)) {
        if (field.type === 'token') {
          expect(tokenFamilies.has(field.tokenFamily), `${meta.name}.${field.label}`).toBe(true);
        }
        if (field.type === 'choice' && field.default !== undefined) {
          expect(field.options).toContain(field.default);
        }
      }
    }
  });

  test('keeps recipe defaults aligned with existing runtime behavior', () => {
    expect(ZORA_THEME_RECIPE_META.Button?.fields.size?.default).toBe('l');
    expect(ZORA_THEME_RECIPE_META.Card?.fields.padding?.default).toBeUndefined();
    expect(ZORA_THEME_RECIPE_META.Text?.fields.weight?.default).toBeUndefined();
    expect(ZORA_THEME_RECIPE_META.Heading?.fields.size?.default).toBeUndefined();
  });

  test('does not persist theme-owned defaults into new instance blueprints', () => {
    for (const [name, meta] of Object.entries(ZORA_COMPONENT_META)) {
      for (const propName of Object.keys(meta.blueprint?.defaultProps ?? {})) {
        expect(
          meta.props[propName]?.authoring?.authority,
          `${name}.${propName} blueprint must not pin a theme-owned value`,
        ).not.toBe('theme');
      }
    }
  });

  test('is serializable for downstream authoring consumers', () => {
    expect(() => JSON.stringify(ZORA_THEME_RECIPE_META)).not.toThrow();
  });
});
''',
"src/metadata/authoringMeta.test.ts": r'''import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentPropAuthoring } from './index';

describe('ZORA component prop authoring authority', () => {
  test('supports instance and theme authority with explicit instance override capability', () => {
    const values: readonly ZoraComponentPropAuthoring[] = [
      { authority: 'instance' },
      { authority: 'theme', scope: 'global' },
      { authority: 'theme', scope: 'component', allowInstanceOverride: true },
      { authority: 'theme', scope: 'pattern', allowInstanceOverride: true },
    ];
    expect(values).toHaveLength(4);
  });

  test('keeps representative content and semantics instance-owned', () => {
    expect(ZORA_COMPONENT_META.Button.props.children?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Card.props.title?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Heading.props.level?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Text.props.text?.authoring).toEqual({ authority: 'instance' });
  });

  test('marks recipe props theme-owned while allowing explicit instance overrides', () => {
    for (const name of ['Button', 'Card', 'Heading', 'Text', 'Panel'] as const) {
      for (const prop of Object.values(ZORA_COMPONENT_META[name].props)) {
        if (prop.authoring?.authority !== 'theme') continue;
        expect(prop.authoring.allowInstanceOverride, name).toBe(true);
      }
    }
  });

  test('keeps Heading blueprint semantic content useful', () => {
    expect(ZORA_COMPONENT_META.Heading.blueprint?.defaultProps).toEqual({ text: 'Heading', level: 2 });
  });

  test('does not introduce a system authority', () => {
    expect(JSON.stringify(ZORA_COMPONENT_META)).not.toContain('"authority":"system"');
  });
});
''',
"src/theme/resolveZoraThemeRecipe.test.ts": r'''import type { ThemeConfig } from '@ankhorage/contracts';
import { createTheme } from '@ankhorage/surface';
import { describe, expect, test } from 'bun:test';

import { resolveZoraThemeRecipe } from './resolveZoraThemeRecipe';

const baseConfig: ThemeConfig = {
  id: 'test', name: 'Test',
  light: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  dark: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  tokens: { spacing: { hero: 64 } },
};

describe('resolveZoraThemeRecipe', () => {
  test('merges metadata defaults with persisted known fields', () => {
    const theme = createTheme({
      ...baseConfig,
      recipes: { components: { Card: { tone: 'outline', padding: 'hero' } } },
    });
    expect(resolveZoraThemeRecipe(theme, 'Card')).toEqual({
      tone: 'outline', padding: 'hero', radius: 'l', compact: false,
    });
  });

  test('ignores stale unknown persisted fields without guessing metadata', () => {
    const theme = createTheme({
      ...baseConfig,
      recipes: { components: { Button: { variant: 'soft', retiredField: 'legacy' } } },
    });
    expect(resolveZoraThemeRecipe(theme, 'Button')).toEqual({
      color: 'primary', variant: 'soft', size: 'l',
    });
  });

  test('rejects invalid known choices and token references', () => {
    const choiceTheme = createTheme({
      ...baseConfig,
      recipes: { components: { Button: { variant: 'neon' } } },
    });
    expect(() => resolveZoraThemeRecipe(choiceTheme, 'Button')).toThrow('Invalid theme recipe choice');

    const tokenTheme = createTheme({
      ...baseConfig,
      recipes: { components: { Card: { padding: 'missing' } } },
    });
    expect(() => resolveZoraThemeRecipe(tokenTheme, 'Card')).toThrow('Unknown spacing token');
  });

  test('rejects code requests for unknown recipe names', () => {
    expect(() => resolveZoraThemeRecipe(createTheme(baseConfig), 'Missing')).toThrow(
      'Unknown ZORA theme recipe',
    );
  });
});
''',
"src/components/button/resolveButtonThemeRecipe.test.ts": r'''import { describe, expect, test } from 'bun:test';

import { resolveButtonThemeRecipe } from './resolveButtonThemeRecipe';

describe('resolveButtonThemeRecipe', () => {
  test('uses theme defaults without changing the existing hard default', () => {
    expect(resolveButtonThemeRecipe({ themeFields: { color: 'primary', variant: 'solid', size: 'l' } })).toEqual({
      color: 'primary', variant: 'solid', size: 'l',
    });
  });

  test('lets explicit instance props override theme recipe values', () => {
    expect(resolveButtonThemeRecipe({
      color: 'danger', size: 's',
      themeFields: { color: 'primary', variant: 'soft', size: 'l' },
    })).toEqual({ color: 'danger', variant: 'soft', size: 's' });
  });
});
''',
"src/components/card/resolveCardThemeRecipe.test.ts": r'''import { describe, expect, test } from 'bun:test';

import { resolveCardThemeRecipe } from './resolveCardThemeRecipe';

describe('resolveCardThemeRecipe', () => {
  test('preserves compact-aware padding when theme padding is unset', () => {
    expect(resolveCardThemeRecipe({ themeFields: { tone: 'default', compact: true, radius: 'l' } })).toEqual({
      tone: 'default', compact: true, padding: 'm', radius: 'l',
    });
  });

  test('lets explicit instance props win over theme values', () => {
    expect(resolveCardThemeRecipe({
      tone: 'outline', compact: false, padding: 'hero', radius: 'pill',
      themeFields: { tone: 'subtle', compact: true, padding: 'm', radius: 'l' },
    })).toEqual({ tone: 'outline', compact: false, padding: 'hero', radius: 'pill' });
  });
});
''',
"src/theme/themeConfigScope.test.ts": r'''import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'bun:test';

const themeDir = import.meta.dir;

describe('canonical ThemeConfig scope propagation', () => {
  test('provider accepts and stores the full canonical ThemeConfig', () => {
    const provider = readFileSync(join(themeDir, 'ZoraProvider.tsx'), 'utf8');
    const context = readFileSync(join(themeDir, 'ZoraThemeRuntimeContext.tsx'), 'utf8');
    expect(provider).toContain('themeConfig?: ThemeConfig');
    expect(provider).toContain('themeConfig ?? createZoraThemeConfig(theme)');
    expect(context).toContain('themeConfig: ThemeConfig');
    expect(context).not.toContain('sourceTheme');
  });

  test('nested scopes reuse the full parent config instead of rebuilding a legacy seed', () => {
    const scope = readFileSync(join(themeDir, 'ZoraThemeScope.tsx'), 'utf8');
    expect(scope).toContain('createTheme(parentRuntime.themeConfig');
    expect(scope).not.toContain('createZoraThemeConfig');
    expect(scope).not.toContain('sourceTheme');
  });
});
''',
}

for path, content in FILES.items():
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding='utf-8')

package_path = Path('package.json')
package = json.loads(package_path.read_text(encoding='utf-8'))
package['dependencies']['@ankhorage/contracts'] = '^7.2.0'
package['dependencies']['@ankhorage/surface'] = '^2.2.0'
package['devDependencies']['@ankhorage/paradox'] = '^0.1.21'
package_path.write_text(json.dumps(package, indent=2) + '\n', encoding='utf-8')

changeset = Path('.changeset/adm13-zora-theme-recipes.md')
changeset.write_text("""---\n'@ankhorage/zora': minor\n---\n\nResolve canonical persisted theme recipe overrides through ZORA-owned metadata, preserve full ThemeConfig across theme scopes, and make explicit component props override inherited recipe defaults without pinning theme-owned values into new manifest blueprints.\n""", encoding='utf-8')

docs = Path('docs/authoring-metadata.md')
text = docs.read_text(encoding='utf-8')
marker = '## Theme recipe runtime precedence'
if marker not in text:
    text += """\n\n## Theme recipe runtime precedence\n\nTheme recipe metadata is the canonical schema for theme-authorable component and pattern defaults. Persisted `ThemeConfig.recipes` stores selected values only. Runtime precedence is:\n\n```text\ncomponent hard behavior\n  <- ZORA recipe metadata default\n  <- persisted ThemeConfig recipe override\n  <- explicit component instance prop (when allowInstanceOverride is true)\n```\n\nUnknown persisted fields are ignored as stale metadata; invalid values for known fields fail explicitly. Token fields must reference a token that exists in the field's declared family. New manifest blueprints do not copy theme-owned defaults into instance props, so theme changes remain inherited.\n\n`ZoraProvider` can receive a canonical `themeConfig`; nested scopes preserve that complete config so authored global tokens and recipes are not lost. The legacy `theme` seed remains supported for standalone consumers and is converted once at the provider boundary.\n"""
    docs.write_text(text, encoding='utf-8')
