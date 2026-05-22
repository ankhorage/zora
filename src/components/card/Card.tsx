import { Card as SurfaceCard } from '@ankhorage/surface';
import React from 'react';

import { Box, Stack } from '../../foundation';
import { resolveCardVariant } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { Text } from '../text';
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
  tone = 'default',
  compact = false,
  onPress,
  ...props
}: CardProps) {
  const hasHeader = [eyebrow, title, description, actions].some((item) => item != null);
  const hasFooter = footer !== undefined;
  const gap = compact ? 's' : 'm';
  const isInteractive = Boolean(onPress) && !actions;

  return (
    <SurfaceCard
      {...props}
      onPress={isInteractive ? onPress : undefined}
      p={compact ? 'm' : 'l'}
      radius="l"
      variant={resolveCardVariant(tone)}
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
                {title ? <Heading level={compact ? 4 : 3}>{title}</Heading> : null}
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
