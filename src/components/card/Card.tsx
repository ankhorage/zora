import { Card as SurfaceCard } from '@ankhorage/surface';
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
