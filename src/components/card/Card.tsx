import { Box, Card as SurfaceCard, Heading, Stack } from '@ankhorage/surface';
import React from 'react';

import { resolveCardVariant } from '../../internal/recipes';
import { Text } from '../text';
import type { CardProps } from './types';

export function Card({
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
            <Box flex={1}>
              <Stack gap="xs">
                {eyebrow ? (
                  <Text tone="muted" variant="caption" weight="semiBold">
                    {eyebrow}
                  </Text>
                ) : null}
                {title ? <Heading level={compact ? 4 : 3}>{title}</Heading> : null}
                {description ? (
                  <Text tone="muted" variant="bodySmall">
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
