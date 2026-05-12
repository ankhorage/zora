import React from 'react';

import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Heading } from '../../components/heading';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { HeroAction, HeroAlign, HeroLayout, HeroProps } from './types';

function HeroInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  media,
  footer,
  align = 'start',
  layout = 'split',
  tone = 'subtle',
  compact = false,
  testID,
}: HeroProps) {
  const hasActions = primaryAction !== undefined || secondaryAction !== undefined;
  const hasMedia = media !== undefined;
  const direction = resolveDirection(layout, hasMedia);
  const contentAlign = resolveContentAlign(align);
  const textAlign = align === 'center' ? 'center' : undefined;
  const mediaFirst = layout === 'mediaFirst';

  const content = (
    <Box flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
      <Stack align={contentAlign} gap={compact ? 's' : 'm'}>
        <Stack align={contentAlign} gap="xs">
          {eyebrow !== undefined ? (
            <Text align={textAlign} tone="primary" variant="eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <Heading
            align={textAlign}
            level={1}
            size={{ base: 'h2', md: compact ? 'h2' : 'display' }}
          >
            {title}
          </Heading>
          {description !== undefined ? (
            <Text
              tone="muted"
              align={textAlign}
              variant={{ base: 'body', md: compact ? 'body' : 'lead' }}
            >
              {description}
            </Text>
          ) : null}
        </Stack>

        {hasActions ? (
          <Stack
            align={contentAlign}
            direction={{ base: 'column', md: 'row' }}
            gap="s"
            justify={align === 'center' ? 'center' : 'flex-start'}
          >
            {primaryAction !== undefined ? renderAction(primaryAction, 'primary') : null}
            {secondaryAction !== undefined ? renderAction(secondaryAction, 'secondary') : null}
          </Stack>
        ) : null}

        {footer}
      </Stack>
    </Box>
  );

  const mediaSlot = hasMedia ? (
    <Box flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
      {media}
    </Box>
  ) : null;

  return (
    <Card compact={compact} testID={testID} tone={tone}>
      <Stack align="center" direction={direction} gap={compact ? 'm' : 'l'}>
        {mediaFirst ? mediaSlot : content}
        {mediaFirst ? content : mediaSlot}
      </Stack>
    </Card>
  );
}

function renderAction(action: HeroAction, role: 'primary' | 'secondary') {
  return (
    <Button
      disabled={action.disabled}
      emphasis={action.emphasis ?? (role === 'primary' ? 'solid' : 'soft')}
      onPress={action.onPress}
      tone={action.tone ?? (role === 'primary' ? 'primary' : 'neutral')}
    >
      {action.label}
    </Button>
  );
}

function resolveContentAlign(align: HeroAlign) {
  return align === 'center' ? 'center' : 'flex-start';
}

function resolveDirection(layout: HeroLayout, hasMedia: boolean) {
  if (!hasMedia || layout === 'stack') return 'column' as const;
  return { base: 'column', md: 'row' } as const;
}

export const Hero = withZoraThemeScope(HeroInner);
